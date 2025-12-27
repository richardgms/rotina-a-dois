'use client';

import { useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { resetAuthInitialization } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import type { User } from '@/types';

/**
 * Hook simplificado de autenticação.
 * 
 * TODA a lógica de inicialização e listeners está no AuthProvider.
 * Este hook apenas:
 * - Retorna dados do store
 * - Expõe funções de login/logout/pareamento
 */
export function useAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = getSupabaseClient();
    const {
        user,
        partner,
        isLoading,
        isAuthenticated,
        setUser,
        setPartner,
        setLoading,
        logout: storeLogout
    } = useAuthStore();

    // Ref para acessar user atual em callbacks
    const userRef = useRef(user);
    userRef.current = user;

    // Login com magic link
    const signInWithEmail = useCallback(async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) throw error;
    }, [supabase]);

    // Login com Google
    const signInWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) throw error;
    }, [supabase]);

    // Logout
    const signOut = useCallback(async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Erro ao sair:', error);
        } finally {
            storeLogout();
            resetAuthInitialization(); // Reset para próximo login
            window.location.href = '/login';
        }
    }, [supabase.auth, storeLogout, setLoading]);

    // Pareamento com parceiro
    const pairWithPartner = useCallback(async (partnerCode: string) => {
        if (!userRef.current) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase.rpc('pair_users', {
            partner_code_input: partnerCode.toUpperCase()
        });

        if (error) throw error;

        if (!data.success) {
            throw new Error(data.message || 'Erro ao parear');
        }

        // Recarregar dados do usuário
        await refetchUser();
        router.push('/');
    }, [supabase, router]);

    // Desvincular parceiro
    const unpairPartner = useCallback(async () => {
        if (!userRef.current) return;

        const { data, error } = await supabase.rpc('unpair_users', {
            user_id: userRef.current.id
        });

        if (error) {
            console.error('Erro ao desvincular (RPC):', error);
            throw new Error('Erro ao desvincular: ' + error.message);
        }

        // Verificar resposta da RPC
        if (data && !data.success) {
            throw new Error(data.message || 'Erro ao desvincular');
        }

        // Atualizar estado local
        setPartner(null);
        if (userRef.current) {
            setUser({ ...userRef.current, partner_id: null });
        }

        toast.success('Parceiro desvinculado com sucesso!');
    }, [supabase, setUser, setPartner]);

    // Recarregar dados do usuário
    const refetchUser = useCallback(async () => {
        if (!userRef.current) return;

        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', userRef.current.id)
            .single();

        if (data) {
            setUser(data as User);

            // Recarregar parceiro se existir
            if (data.partner_id) {
                const { data: partnerData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.partner_id)
                    .single();

                if (partnerData) {
                    setPartner(partnerData as User);
                }
            } else {
                setPartner(null);
            }
        }
    }, [supabase, setUser, setPartner]);

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
        refetchUser,
    };
}
