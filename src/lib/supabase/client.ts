import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                // Usar redirect em vez de popup para melhor compatibilidade com PWA
                flowType: 'pkce',
                // Persistir sessão no localStorage
                persistSession: true,
                // Detectar sessão de outras abas
                detectSessionInUrl: true,
                // Auto refresh token
                autoRefreshToken: true,
            }
        }
    );
}

// Singleton para uso em componentes client
let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
    if (!client) {
        client = createClient();
    }
    return client;
}
