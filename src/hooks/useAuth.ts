'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import type { User } from '@/types';

export function useAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = getSupabaseClient();
    const { user, partner, isLoading, isAuthenticated, setUser, setPartner, setLoading, logout } = useAuthStore();
    const hasFetched = useRef(false);
    const fetchingPromiseRef = useRef<Promise<unknown> | null>(null);

    const fetchUser = useCallback(async () => {
        // Se já está buscando, retorna a Promise existente (evita race condition)
        if (fetchingPromiseRef.current) {
            return fetchingPromiseRef.current;
        }

        const fetchPromise = (async () => {
            try {
                const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

                if (authError || !authUser) {
                    // Se não há usuário autenticado no Supabase, limpa o store local
                    if (user) logout();
                    setLoading(false);
                    return null;
                }

                // Buscar dados do usuário
                const { data: userData, error: dbError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                if (dbError) {
                    // toast.error('Erro ao carregar dados do usuário.');
                    // setUser(null);
                    setLoading(false);
                    return null;
                }

                // Buscar parceiro em paralelo se existir partner_id
                if (userData?.partner_id) {
                    setUser(userData as User);

                    const { data: partnerData } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', userData.partner_id)
                        .single();

                    if (partnerData) {
                        setPartner(partnerData as User);
                    }
                } else {
                    setUser(userData as User);
                }

                setLoading(false);
                return userData;
            } catch {
                // setUser(null);
                setLoading(false);
                return null;
            } finally {
                fetchingPromiseRef.current = null;
            }
        })();

        fetchingPromiseRef.current = fetchPromise;
        return fetchPromise;
    }, [supabase, setUser, setPartner, setLoading, logout, user]);

    // Login com magic link
    const signInWithEmail = async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
    };

    // Login com Google
    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
    };

    // Logout memoizado para evitar re-renders e inconsistências
    const signOut = useCallback(async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Erro ao sair:', error);
        } finally {
            // Limpeza "nuclear" para garantir logout completo
            logout();
            // Força um full reload para limpar qualquer estado de memória e cache do Next.js
            window.location.href = '/login';
        }
    }, [supabase.auth, logout, setLoading]);

    // Pareamento
    const pairWithPartner = async (partnerCode: string) => {
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase.rpc('pair_users', {
            partner_code_input: partnerCode
        });

        if (error) throw error;

        if (!data.success) {
            throw new Error(data.message || 'Erro ao parear');
        }

        await fetchUser();
        router.push('/');
    };

    // Listener de auth
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchUser();
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: string) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    await fetchUser();
                } else if (event === 'SIGNED_OUT') {
                    logout();
                    window.location.href = '/login';
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [fetchUser, logout, supabase.auth]);

    // Verificação de pareamento no cliente (movida do middleware)
    useEffect(() => {
        if (!isLoading && user && !user.partner_id && pathname !== '/pairing') {
            const skipUntil = localStorage.getItem('skip_pairing_until');
            if (skipUntil && parseInt(skipUntil) > Date.now()) {
                return;
            }
            router.push('/pairing');
        }
    }, [user, isLoading, pathname, router]);

    // Desvincular parceiro
    const unpairPartner = async () => {
        if (!user) return;

        // Tentar usar a RPC segura primeiro
        const { error } = await supabase.rpc('unpair_users', {
            user_id: user.id
        });

        if (error) {
            console.error('Erro ao desvincular (RPC):', error);
            // Fallback para update simples (funciona apenas para o lado do usuário se RPC falhar/não existir)
            // Mas o ideal é que o usuário rode o SQL fornecido.
            const { error: updateError } = await supabase
                .from('users')
                .update({ partner_id: null })
                .eq('id', user.id);

            if (updateError) throw updateError;
        }

        // Atualizar estado local
        setPartner(null);
        setUser({ ...user, partner_id: null });

        await fetchUser();
        toast.success('Parceiro desvinculado.');
    };

    return {
        user,
        partner,
        isLoading,
        isAuthenticated,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        pairWithPartner,
        unpairPartner,
        refetchUser: fetchUser,
    };
}

