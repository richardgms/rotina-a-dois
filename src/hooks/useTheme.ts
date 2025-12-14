'use client';

import { useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export function useTheme() {
    const supabase = getSupabaseClient();
    const { user, setUser } = useAuthStore();

    const theme = user?.theme || 'ocean';
    const fontSize = user?.font_size || 'normal';

    // Aplicar tema no documento
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-font-size', fontSize);
    }, [theme, fontSize]);

    // Trocar tema
    const setTheme = useCallback(async (newTheme: 'ocean' | 'midnight') => {
        if (!user) return;

        const { error } = await supabase
            .from('users')
            .update({ theme: newTheme })
            .eq('id', user.id);

        if (error) {
            console.error('Erro ao atualizar tema:', error);
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
