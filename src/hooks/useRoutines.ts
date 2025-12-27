'use client';

import { useCallback, useMemo, useRef } from 'react';
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

    const hasFetched = useRef(false);

    // Buscar rotinas do usuário - OTIMIZADO
    const fetchRoutines = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        // Só mostra loading se não temos dados ainda
        const hasData = useRoutineStore.getState().routines.length > 0;
        if (!hasData) {
            setLoading(true);
        }

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

    // Rotinas do dia selecionado - MEMOIZADO
    const routinesForDay = useMemo(
        () => routines.filter((r) => r.day_of_week === selectedDay),
        [routines, selectedDay]
    );

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
        (data as Routine[])?.forEach((r) => addRoutine(r));
    };

    // Reordenar rotinas - batch upsert para melhor performance
    const reorderRoutines = async (routineIds: string[]) => {
        const updates = routineIds.map((id, index) => ({
            id,
            sort_order: index,
        }));

        // Usar upsert para atualizar todos de uma vez
        const { error } = await supabase
            .from('routines')
            .upsert(updates, { onConflict: 'id', ignoreDuplicates: false });

        if (error) throw error;

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
