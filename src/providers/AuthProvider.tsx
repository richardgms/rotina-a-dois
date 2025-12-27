'use client';

import { useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';

// Flag global para garantir inicialização única em todo o app
let authInitialized = false;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = getSupabaseClient();
    const { setUser, setPartner, setLoading, logout } = useAuthStore();
    const initRef = useRef(false);

    useEffect(() => {
        // Garantir que só inicializa uma vez em todo o app
        if (authInitialized || initRef.current) {
            console.log('[AuthProvider] Já inicializado, ignorando');
            return;
        }
        initRef.current = true;
        authInitialized = true;

        console.log('[AuthProvider] Inicializando auth (única vez)');

        const fetchUser = async () => {
            try {
                console.log('[AuthProvider] Buscando usuário...');

                // Timeout de 10 segundos para supabase.auth.getUser()
                const AUTH_TIMEOUT_MS = 10000;
                const timeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error('AUTH_TIMEOUT')), AUTH_TIMEOUT_MS);
                });

                let authUser;
                let authError;

                try {
                    const result = await Promise.race([
                        supabase.auth.getUser(),
                        timeoutPromise
                    ]);
                    authUser = result.data?.user;
                    authError = result.error;
                    console.log('[AuthProvider] supabase.auth.getUser() completou');
                } catch (timeoutErr) {
                    console.error('[AuthProvider] TIMEOUT: supabase.auth.getUser() demorou mais de 10s');
                    setLoading(false);
                    return;
                }

                if (authError || !authUser) {
                    console.log('[AuthProvider] Sem usuário autenticado');
                    setUser(null);
                    setLoading(false);
                    return;
                }

                console.log('[AuthProvider] Usuário autenticado:', authUser.id);

                // Buscar dados do usuário no banco
                const { data: userData, error: dbError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                if (dbError) {
                    console.error('[AuthProvider] Erro ao buscar dados do usuário:', dbError.message);
                    setLoading(false);
                    return;
                }

                if (userData) {
                    setUser(userData as User);
                    console.log('[AuthProvider] Dados do usuário carregados');

                    // Buscar parceiro se existir
                    if (userData.partner_id) {
                        const { data: partnerData } = await supabase
                            .from('users')
                            .select('*')
                            .eq('id', userData.partner_id)
                            .single();

                        if (partnerData) {
                            setPartner(partnerData as User);
                            console.log('[AuthProvider] Dados do parceiro carregados');
                        }
                    }
                }

                console.log('[AuthProvider] Inicialização concluída com sucesso');
            } catch (err) {
                console.error('[AuthProvider] Erro inesperado:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        // Buscar usuário inicial
        fetchUser();

        // Listener de mudanças de auth (único para todo o app)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: string) => {
                console.log('[AuthProvider] Auth event:', event);

                if (event === 'SIGNED_OUT') {
                    logout();
                    authInitialized = false; // Reset para próximo login
                } else if (event === 'TOKEN_REFRESHED') {
                    // Recarregar dados do usuário se token foi renovado
                    await fetchUser();
                }
                // Ignorar SIGNED_IN e INITIAL_SESSION - já lidamos no fetchUser inicial
            }
        );

        return () => {
            console.log('[AuthProvider] Cleanup');
            subscription.unsubscribe();
        };
    }, [supabase, setUser, setPartner, setLoading, logout]);

    return <>{children}</>;
}

// Função para resetar o estado de inicialização (útil para testes ou logout completo)
export function resetAuthInitialization() {
    authInitialized = false;
}
