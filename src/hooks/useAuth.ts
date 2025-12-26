'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';

export function useAuth() {
    console.log('useAuth chamado');
    const router = useRouter();
    const pathname = usePathname();
    const supabase = getSupabaseClient();
    const { user, partner, isLoading, isAuthenticated, setUser, setPartner, setLoading, logout } = useAuthStore();
    const hasFetched = useRef(false);

    const fetchingRef = useRef(false);

    // Buscar usuário atual - OTIMIZADO com Promise.all
    const fetchUser = useCallback(async () => {
        if (fetchingRef.current) {
            console.log('>>> fetchUser: já em andamento, ignorando');
            return null;
        }

        fetchingRef.current = true;
        console.log('>>> fetchUser: iniciando');

        try {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

            console.log('>>> fetchUser: auth.getUser resultado:', { authUser: authUser?.id, authError });

            if (authError || !authUser) {
                console.log('>>> fetchUser: sem usuário autenticado');
                setUser(null);
                setLoading(false);
                return null;
            }

            console.log('>>> fetchUser: buscando dados do usuário no banco...');

            // Buscar dados do usuário
            const { data: userData, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            console.log('>>> fetchUser: dados do banco:', { userData, dbError });

            if (dbError) {
                console.error('>>> fetchUser: erro no banco:', dbError);
                setUser(null);
                setLoading(false);
                return null;
            }

            console.log('>>> fetchUser: setando user:', userData.id);

            // Buscar parceiro em PARALELO se existir partner_id
            if (userData?.partner_id) {
                // Atualiza user primeiro para exibir dados rapidamente
                setUser(userData as User);

                console.log('>>> fetchUser: buscando parceiro...');
                // Busca parceiro em background
                const { data: partnerData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userData.partner_id)
                    .single();

                if (partnerData) {
                    console.log('>>> fetchUser: parceiro encontrado', partnerData.id);
                    setPartner(partnerData as User);
                }
            } else {
                setUser(userData as User);
            }

            setLoading(false);
            return userData;
        } catch (error) {
            console.error('>>> fetchUser: ERRO:', error);
            setUser(null);
            setLoading(false);
            return null;
        } finally {
            fetchingRef.current = false;
        }
    }, [supabase, setUser, setPartner, setLoading]);

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

    // Logout
    const signOut = async () => {
        await supabase.auth.signOut();
        logout();
        router.push('/login');
    };

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

    // Listener de auth - OTIMIZADO para evitar múltiplos fetches
    useEffect(() => {
        // Evita fetch duplicado se já foi feito
        if (!hasFetched.current) {
            console.log('>>> useAuth useEffect: chamando fetchUser (primeira vez)');
            hasFetched.current = true;
            fetchUser();
        } else {
            console.log('>>> useAuth useEffect: fetchUser já foi chamado, ignorando');
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: string, session) => {
                console.log('>>> Auth change event:', event);

                // Só reagir se realmente necessário
                const shouldFetch = (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && !user;

                if (shouldFetch) {
                    console.log('>>> Auth change: fetching user because not loaded yet');
                    await fetchUser();
                } else if (event === 'SIGNED_OUT') {
                    logout();
                } else {
                    console.log('>>> Auth change: ignorando pois user já existe ou evento irrelevante');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [fetchUser, logout, supabase.auth, user]); // Added user dependency to check it inside listener

    // Verificação de pareamento no cliente (movida do middleware)
    useEffect(() => {
        if (!isLoading && user && !user.partner_id && pathname !== '/pairing') {
            router.push('/pairing');
        }
    }, [user, isLoading, pathname, router]);

    return {
        user,
        partner,
        isLoading,
        isAuthenticated,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        pairWithPartner,
        refetchUser: fetchUser,
    };
}

