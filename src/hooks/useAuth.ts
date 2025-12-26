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

    const fetchingRef = useRef(false);

    // Buscar usuário atual
    const fetchUser = useCallback(async () => {
        if (fetchingRef.current) return null;

        fetchingRef.current = true;

        try {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

            if (authError || !authUser) {
                setUser(null);
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
                console.error('Erro ao buscar usuário:', dbError);
                toast.error('Erro ao carregar dados do usuário.');
                setUser(null);
                setLoading(false);
                return null;
            }

            // Buscar parceiro em PARALELO se existir partner_id
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
        } catch (error) {
            console.error('Erro no fetchUser:', error);
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

    // Listener de auth simplification
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchUser();
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: string) => {
                if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && !user) {
                    await fetchUser();
                } else if (event === 'SIGNED_OUT') {
                    logout();
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

