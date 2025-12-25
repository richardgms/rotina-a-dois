'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function signInWithMagicLink(email: string) {
    const supabase = await createClient();
    const origin = (await headers()).get('origin');

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            // Usa o origin da requisição ou fallback para localhost
            emailRedirectTo: `${origin || 'http://localhost:3000'}/auth/callback`,
        },
    });

    if (error) {
        console.error('Error sending magic link:', error);
        throw new Error(error.message);
    }

    return { success: true };
}
