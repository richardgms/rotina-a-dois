import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
    user: User | null;
    partner: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

interface AuthActions {
    setUser: (user: User | null) => void;
    setPartner: (partner: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            user: null,
            partner: null,
            isLoading: true,
            isAuthenticated: false,

            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                }),

            setPartner: (partner) => set({ partner }),

            setLoading: (isLoading) => set({ isLoading }),

            logout: () =>
                set({
                    user: null,
                    partner: null,
                    isAuthenticated: false,
                    isLoading: false, // IMPORTANTE: garantir que loading = false no logout
                }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                partner: state.partner,
            }),
            // Quando o store for reidratado do localStorage, garantir estado consistente
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Se não há user no storage, garantir isLoading = false
                    if (!state.user) {
                        state.isLoading = false;
                    }
                    console.log('[authStore] Reidratado do localStorage, user:', state.user?.id || 'null');
                }
            },
        }
    )
);
