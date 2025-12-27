import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

// Gera código de pareamento criptograficamente seguro
function generatePairingCode(): string {
    const bytes = randomBytes(4);
    return bytes.toString('hex').toUpperCase().substring(0, 6);
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = await createClient();

        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('Auth error:', error);
            return NextResponse.redirect(new URL(`/login?error=auth_code_error&message=${encodeURIComponent(error.message)}`, requestUrl.origin));
        }

        if (user) {
            // Verificar se usuário existe na tabela users
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single();

            // Se não existe, criar
            if (!existingUser) {
                const pairingCode = generatePairingCode();
                const email = user.email ?? user.user_metadata?.email ?? '';
                const name = email ? email.split('@')[0] : 'Usuário';

                const { error: insertError } = await supabase.from('users').insert({
                    id: user.id,
                    email,
                    name,
                    pairing_code: pairingCode,
                });

                if (insertError) {
                    console.error('Error creating user:', insertError);
                    return NextResponse.redirect(new URL(`/login?error=user_creation_failed&message=${encodeURIComponent(insertError.message)}`, requestUrl.origin));
                }

                return NextResponse.redirect(new URL('/pairing', requestUrl.origin));
            }

            // Verificar se tem parceiro
            const { data: userData } = await supabase
                .from('users')
                .select('partner_id')
                .eq('id', user.id)
                .single();

            if (!userData?.partner_id) {
                return NextResponse.redirect(new URL('/pairing', requestUrl.origin));
            }
        }
    } else {
        return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin));
    }

    return NextResponse.redirect(new URL('/', requestUrl.origin));
}
