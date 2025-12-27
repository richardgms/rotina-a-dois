'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function signInWithMagicLink(email: string) {
    const supabase = await createClient();
    const origin = (await headers()).get('origin');

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            // IMPORTANTE: Usar a URL canônica de produção para garantir que bata com a whitelist do Supabase
            // Se estivermos em localhost, usa localhost. Caso contrário, força a URL de produção.
            emailRedirectTo: process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000/auth/callback'
                : 'https://rotina-a-dois.netlify.app/auth/callback',
        },
    });

    if (error) {
        console.error('Error sending magic link:', error);
        throw new Error(error.message);
    }

    return { success: true };
}
