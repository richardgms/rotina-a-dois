'use client';

import { useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

const THEME_STORAGE_KEY = 'rotina-theme';

export function useTheme() {
    const supabase = getSupabaseClient();
    const { user, setUser } = useAuthStore();

    const theme = user?.theme || 'ocean';
    const fontSize = user?.font_size || 'normal';

    // Aplicar tema no documento - também lê do localStorage se user ainda não carregou
    useEffect(() => {
        // Se user já carregou, usa o tema dele e salva no localStorage
        if (user?.theme) {
            document.documentElement.setAttribute('data-theme', user.theme);
            localStorage.setItem(THEME_STORAGE_KEY, user.theme);
        } else {
            // Se user ainda não carregou, tenta ler do localStorage
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as 'ocean' | 'midnight' | null;
            document.documentElement.setAttribute('data-theme', savedTheme || 'ocean');
        }
        document.documentElement.setAttribute('data-font-size', fontSize);
    }, [user?.theme, fontSize]);

    // Trocar tema
    const setTheme = useCallback(async (newTheme: 'ocean' | 'midnight') => {
        if (!user) {
            return;
        }

        // Aplica imediatamente no DOM e localStorage
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);

        const { error } = await supabase
            .from('users')
            .update({ theme: newTheme })
            .eq('id', user.id);

        if (error) {
            console.error('Erro ao atualizar tema:', error);
            // Reverte se deu erro
            document.documentElement.setAttribute('data-theme', user.theme || 'ocean');
            localStorage.setItem(THEME_STORAGE_KEY, user.theme || 'ocean');
            return;
        }

        setUser({ ...user, theme: newTheme });
    }, [user, supabase, setUser]);

    // Trocar tamanho da fonte
    const setFontSize = useCallback(async (newSize: 'normal' | 'large') => {
        if (!user) return;

        const { error } = await supabase
            .from('users')
            .update({ font_size: newSize })
            .eq('id', user.id);

        if (error) {
            console.error('Erro ao atualizar fonte:', error);
            return;
        }

        setUser({ ...user, font_size: newSize });
    }, [user, supabase, setUser]);

    return {
        theme,
        fontSize,
        setTheme,
        setFontSize,
        isOcean: theme === 'ocean',
        isMidnight: theme === 'midnight',
    };
}
