'use client';

import { useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRoutineStore } from '@/stores/routineStore';
import { useAuthStore } from '@/stores/authStore';
import type { Routine } from '@/types';

export function useRoutines() {
    const supabase = getSupabaseClient();
    const { user } = useAuthStore();
    const {
        routines,
        selectedDay,
        isLoading,
        setRoutines,
        setLoading,
        addRoutine,
        updateRoutine,
        deleteRoutine,
    } = useRoutineStore();

    // Buscar rotinas do usuário
    const fetchRoutines = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('routines')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .order('sort_order');

            if (error) throw error;
            setRoutines(data as Routine[]);
        } catch (error) {
            console.error('Erro ao buscar rotinas:', error);
        } finally {
            setLoading(false);
        }
    }, [user, supabase, setRoutines, setLoading]);

    // Rotinas do dia selecionado
    const routinesForDay = routines.filter((r) => r.day_of_week === selectedDay);

    // Criar nova rotina
    const createRoutine = async (data: Omit<Routine, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
        if (!user) return;

        const { data: newRoutine, error } = await supabase
            .from('routines')
            .insert({
                ...data,
                user_id: user.id,
            })
            .select()
            .single();

        if (error) throw error;
        addRoutine(newRoutine as Routine);
        return newRoutine;
    };

    // Atualizar rotina
    const editRoutine = async (id: string, data: Partial<Routine>) => {
        const { error } = await supabase
            .from('routines')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
        updateRoutine(id, data);
    };

    // Deletar rotina
    const removeRoutine = async (id: string) => {
        const { error } = await supabase
            .from('routines')
            .update({ is_active: false })
            .eq('id', id);

        if (error) throw error;
        deleteRoutine(id);
    };

    // Clonar rotina para outros dias
    const cloneRoutineToDay = async (routineId: string, targetDays: number[]) => {
        const routine = routines.find((r) => r.id === routineId);
        if (!routine || !user) return;

        const clones = targetDays.map((day) => ({
            ...routine,
            id: undefined,
            day_of_week: day,
            user_id: user.id,
            created_at: undefined,
            updated_at: undefined,
        }));

        const { data, error } = await supabase
            .from('routines')
            .insert(clones)
            .select();

        if (error) throw error;
        data?.forEach((r) => addRoutine(r as Routine));
    };

    // Reordenar rotinas
    const reorderRoutines = async (routineIds: string[]) => {
        const updates = routineIds.map((id, index) => ({
            id,
            sort_order: index,
        }));

        for (const update of updates) {
            await supabase
                .from('routines')
                .update({ sort_order: update.sort_order })
                .eq('id', update.id);
        }

        await fetchRoutines();
    };

    return {
        routines,
        routinesForDay,
        isLoading,
        fetchRoutines,
        createRoutine,
        editRoutine,
        removeRoutine,
        cloneRoutineToDay,
        reorderRoutines,
    };
}
