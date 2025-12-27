'use client';

import { useCallback } from 'react';
import { format } from 'date-fns';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRoutineStore } from '@/stores/routineStore';
import { useAuthStore } from '@/stores/authStore';
import type { DailyStatus, EnergyLevel, Mood } from '@/types';

export function useDailyStatus() {
    const supabase = getSupabaseClient();
    const { user } = useAuthStore();
    const { dailyStatus, selectedDate, setDailyStatus } = useRoutineStore();

    const fetchDailyStatus = useCallback(async (date?: Date) => {
        if (!user) return;

        const targetDate = date || selectedDate;
        const dateStr = format(targetDate, 'yyyy-MM-dd');

        try {
            const { data, error } = await supabase
                .from('daily_status')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', dateStr)
                .eq('date', dateStr)
                .maybeSingle();

            if (error) throw error;
            setDailyStatus(data as DailyStatus | null);
        } catch (error) {
            console.error('Erro ao buscar daily status:', error);
        }
    }, [user, selectedDate, supabase, setDailyStatus]);

    const saveDailyStatus = async (energy: EnergyLevel, mood: Mood) => {
        if (!user) return;

        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        try {
            const { data, error } = await supabase
                .from('daily_status')
                .upsert({
                    user_id: user.id,
                    date: dateStr,
                    energy_level: energy,
                    mood: mood,
                }, { onConflict: 'user_id, date' })
                .select()
                .single();

            if (error) throw error;
            setDailyStatus(data as DailyStatus);
        } catch (error: unknown) {
            const err = error as { message?: string; code?: string; details?: string; hint?: string };
            console.error('Erro ao salvar daily status:', {
                message: err.message,
                code: err.code,
                details: err.details,
                hint: err.hint
            });
            throw error;
        }
    };

    const activateDifficultDay = async () => {
        if (!user) return;

        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        try {
            const { data, error } = await supabase
                .from('daily_status')
                .upsert({
                    user_id: user.id,
                    date: dateStr,
                    energy_level: 'low',
                    mood: 'difficult',
                })
                .select()
                .single();

            if (error) throw error;
            setDailyStatus(data as DailyStatus);
        } catch (error) {
            console.error('Erro ao ativar dia difícil:', error);
            throw error;
        }
    };

    return {
        dailyStatus,
        fetchDailyStatus,
        saveDailyStatus,
        activateDifficultDay,
    };
}
