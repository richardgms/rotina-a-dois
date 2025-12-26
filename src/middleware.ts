import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Verificação de autenticação - apenas getUser (1 query)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Rotas públicas
    const publicRoutes = ['/login', '/auth/callback', '/pairing'];
    const isPublicRoute = publicRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    // Não autenticado tentando acessar rota protegida
    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Autenticado tentando acessar login
    if (user && request.nextUrl.pathname === '/login') {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // NOTA: Verificação de pareamento movida para o lado do cliente (useAuth)
    // para evitar query extra no middleware em CADA requisição

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)',
    ],
};
