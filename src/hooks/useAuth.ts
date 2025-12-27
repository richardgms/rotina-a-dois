'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import type { User } from '@/types';

// CORREÇÃO 2: hasFetched global (nível do módulo) - garante 1 fetch por sessão do app
let globalHasFetched = false;

export function useAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = getSupabaseClient();
    const { user, partner, isLoading, isAuthenticated, setUser, setPartner, setLoading, logout } = useAuthStore();
    const fetchingPromiseRef = useRef<Promise<unknown> | null>(null);

    // CORREÇÃO 1: useRef para acessar user atual sem colocar nas dependências
    const userRef = useRef(user);
    userRef.current = user;

    const fetchUser = useCallback(async () => {
        // Se já está buscando, retorna a Promise existente (evita race condition)
        if (fetchingPromiseRef.current) {
            return fetchingPromiseRef.current;
        }

        const fetchPromise = (async () => {
            try {
                console.log('[useAuth] Iniciando fetchUser...');

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
                    console.log('[useAuth] supabase.auth.getUser() completou');
                } catch (timeoutErr) {
                    console.error('[useAuth] TIMEOUT: supabase.auth.getUser() demorou mais de 10s');
                    // Se timeout, limpar estado e permitir que o usuário tente de novo
                    setLoading(false);
                    return null;
                }

                if (authError) {
                    console.error('[useAuth] Erro ao obter usuário:', authError.message);
                    // CORREÇÃO 1: usar userRef em vez de user
                    if (userRef.current) logout();
                    setLoading(false);
                    return null;
                }

                if (!authUser) {
                    console.log('[useAuth] Nenhum usuário autenticado');
                    // CORREÇÃO 1: usar userRef em vez de user
                    if (userRef.current) logout();
                    setLoading(false);
                    return null;
                }

                console.log('[useAuth] Usuário autenticado:', authUser.id);

                // Buscar dados do usuário com timeout também
                const DB_TIMEOUT_MS = 10000;
                const dbTimeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error('DB_TIMEOUT')), DB_TIMEOUT_MS);
                });

                let userData;
                let dbError;

                try {
                    const result = await Promise.race([
                        supabase
                            .from('users')
                            .select('*')
                            .eq('id', authUser.id)
                            .single(),
                        dbTimeoutPromise
                    ]);
                    userData = result.data;
                    dbError = result.error;
                } catch (timeoutErr) {
                    console.error('[useAuth] TIMEOUT: busca de dados do usuário demorou mais de 10s');
                    setLoading(false);
                    return null;
                }

                if (dbError) {
                    console.error('[useAuth] Erro ao buscar dados do usuário:', dbError.message);
                    setLoading(false);
                    return null;
                }

                console.log('[useAuth] Dados do usuário carregados');

                // Buscar parceiro se existir partner_id
                if (userData?.partner_id) {
                    setUser(userData as User);

                    const { data: partnerData, error: partnerError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', userData.partner_id)
                        .single();

                    if (partnerError) {
                        console.error('[useAuth] Erro ao buscar parceiro:', partnerError.message);
                    } else if (partnerData) {
                        setPartner(partnerData as User);
                    }
                } else {
                    setUser(userData as User);
                }

                setLoading(false);
                console.log('[useAuth] fetchUser concluído com sucesso');
                return userData;
            } catch (error) {
                console.error('[useAuth] Erro inesperado em fetchUser:', error);
                setLoading(false);
                return null;
            } finally {
                fetchingPromiseRef.current = null;
            }
        })();

        fetchingPromiseRef.current = fetchPromise;
        return fetchPromise;
        // CORREÇÃO 1: Removido 'user' das dependências - usar userRef.current em vez disso
    }, [supabase, setUser, setPartner, setLoading, logout]);

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
            globalHasFetched = false; // Reset para permitir novo fetch após login
            // Força um full reload para limpar qualquer estado de memória e cache do Next.js
            window.location.href = '/login';
        }
    }, [supabase.auth, logout, setLoading]);

    // Pareamento
    const pairWithPartner = async (partnerCode: string) => {
        if (!userRef.current) throw new Error('Usuário não autenticado');

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

    // Listener de auth - CORREÇÃO 2: usa globalHasFetched, CORREÇÃO 5: evita duplicação
    useEffect(() => {
        // CORREÇÃO 2: só chama se nunca chamou globalmente
        if (!globalHasFetched) {
            globalHasFetched = true;
            console.log('[useAuth] Primeiro fetch global iniciado');
            fetchUser();
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: string) => {
                console.log('[useAuth] onAuthStateChange:', event);

                // CORREÇÃO 5: Só chamar fetchUser se:
                // - TOKEN_REFRESHED (precisa atualizar dados)
                // - SIGNED_IN e NÃO temos user no store (primeiro login)
                if (event === 'TOKEN_REFRESHED') {
                    await fetchUser();
                } else if (event === 'SIGNED_IN' && !userRef.current) {
                    // Só busca se não tem user - evita duplicação no load inicial
                    await fetchUser();
                } else if (event === 'SIGNED_OUT') {
                    logout();
                    globalHasFetched = false; // Reset para próximo login
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

