'use client';

import { useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';
import { Session, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Flag global para garantir inicialização única em todo o app
let authInitialized = false;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = getSupabaseClient();
    const { setUser, setPartner, setLoading, logout } = useAuthStore();
    const initRef = useRef(false);

    const fetchUser = async (userId?: string) => {
        try {
            console.log('[AuthProvider] Buscando dados do usuário...');

            // Se userId não for fornecido, tenta pegar da sessão atual
            let currentUserId = userId;
            if (!currentUserId) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    console.log('[AuthProvider] Sem sessão ativa');
                    setUser(null);
                    setLoading(false);
                    return;
                }
                currentUserId = user.id;
            }

            console.log('[AuthProvider] Usuário autenticado:', currentUserId);

            // Buscar dados do usuário no banco
            const { data: userData, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('id', currentUserId)
                .single();

            if (dbError) {
                console.error('[AuthProvider] Erro ao buscar dados do usuário:', dbError.message);
                setLoading(false);
                return;
            }

            if (userData) {
                // Atualizar estado apenas se houve mudança real pode ser uma otimização, 
                // mas por segurança atualizamos sempre que o realtime avisar
                setUser(userData as User);

                // Buscar parceiro se existir
                if (userData.partner_id) {
                    const { data: partnerData } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', userData.partner_id)
                        .single();

                    if (partnerData) {
                        setPartner(partnerData as User);
                    }
                } else {
                    setPartner(null);
                }
            }
        } catch (err) {
            console.error('[AuthProvider] Erro inesperado:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Garantir que só inicializa uma vez em todo o app (para auth inicial)
        if (!authInitialized && !initRef.current) {
            initRef.current = true;
            authInitialized = true;
            fetchUser();
        }

        // Configurar listener de Auth State
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: string, session: Session | null) => {
                if (event === 'SIGNED_OUT') {
                    logout();
                    authInitialized = false;
                } else if (event === 'TOKEN_REFRESHED') {
                    fetchUser(session?.user.id);
                } else if (event === 'SIGNED_IN') {
                    // Refetch garantido ao logar
                    fetchUser(session?.user.id);
                }
            }
        );

        // Configurar Realtime Subscription na tabela 'users'
        // Isso permite atualizações instantâneas (ex: desvinculação)
        const channel = supabase
            .channel('users_realtime')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'users',
                },
                async (payload: RealtimePostgresChangesPayload<User>) => {
                    const { user: currentUser } = useAuthStore.getState();

                    // Só nos importamos com mudanças no NOSSO usuário
                    if (currentUser && payload.new && (payload.new as User).id === currentUser.id) {
                        const newUser = payload.new as User;

                        // Atualizar store diretamente com os novos dados
                        setUser(newUser);

                        // Se partner_id mudou, precisamos buscar (ou limpar) o parceiro
                        if (newUser.partner_id !== currentUser.partner_id) {
                            if (newUser.partner_id) {
                                // Buscamos o novo parceiro
                                const { data: partnerData } = await supabase
                                    .from('users')
                                    .select('*')
                                    .eq('id', newUser.partner_id)
                                    .single();
                                if (partnerData) setPartner(partnerData as User);
                            } else {
                                // Parceiro removido
                                setPartner(null);
                            }
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            console.log('[AuthProvider] Cleanup');
            subscription.unsubscribe();
            supabase.removeChannel(channel);
        };
    }, [supabase, setUser, setPartner, setLoading, logout]);

    return <>{children}</>;
}

// Função para resetar o estado de inicialização (útil para testes ou logout completo)
export function resetAuthInitialization() {
    authInitialized = false;
}
