'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';

export function useAuth() {
    const router = useRouter();
    const supabase = getSupabaseClient();
    const { user, partner, isLoading, isAuthenticated, setUser, setPartner, setLoading, logout } = useAuthStore();

    // Buscar usuário atual
    const fetchUser = useCallback(async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                setUser(null);
                return null;
            }

            const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error) throw error;

            setUser(userData as User);

            // Buscar parceiro se existir
            if (userData?.partner_id) {
                const { data: partnerData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userData.partner_id)
                    .single();

                if (partnerData) {
                    setPartner(partnerData as User);
                }
            }

            return userData;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            setUser(null);
            return null;
        }
    }, [supabase, setUser, setPartner]);

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

        // Buscar parceiro pelo código
        const { data: partnerData, error: findError } = await supabase
            .from('users')
            .select('*')
            .eq('pairing_code', partnerCode.toUpperCase())
            .single();

        if (findError || !partnerData) {
            throw new Error('Código inválido');
        }

        if (partnerData.partner_id) {
            throw new Error('Esta pessoa já tem um parceiro vinculado');
        }

        // Vincular os dois
        const { error: updateError } = await supabase
            .from('users')
            .update({ partner_id: partnerData.id })
            .eq('id', user.id);

        if (updateError) throw updateError;

        const { error: updatePartnerError } = await supabase
            .from('users')
            .update({ partner_id: user.id })
            .eq('id', partnerData.id);

        if (updatePartnerError) throw updatePartnerError;

        setPartner(partnerData as User);
        router.push('/');
    };

    // Listener de auth
    useEffect(() => {
        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event) => {
                if (event === 'SIGNED_IN') {
                    await fetchUser();
                } else if (event === 'SIGNED_OUT') {
                    logout();
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [fetchUser, logout, supabase.auth]);

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
