import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = await createClient();

        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && user) {
            // Verificar se usuário existe na tabela users
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single();

            // Se não existe, criar
            if (!existingUser) {
                const pairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();

                await supabase.from('users').insert({
                    id: user.id,
                    email: user.email!,
                    name: user.email!.split('@')[0],
                    pairing_code: pairingCode,
                });

                // Redirecionar para pareamento
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
    }

    return NextResponse.redirect(new URL('/', requestUrl.origin));
}
