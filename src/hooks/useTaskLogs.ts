'use client';

import { useCallback } from 'react';
import { format } from 'date-fns';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRoutineStore } from '@/stores/routineStore';
import { useAuthStore } from '@/stores/authStore';
import type { TaskLog, TaskStatus } from '@/types';

export function useTaskLogs() {
    const supabase = getSupabaseClient();
    const { user } = useAuthStore();
    const { todayTasks, selectedDate, setTodayTasks, updateTaskStatus } = useRoutineStore();

    // Buscar logs do dia
    const fetchTaskLogs = useCallback(async (date?: Date) => {
        if (!user) return;

        const targetDate = date || selectedDate;
        const dateStr = format(targetDate, 'yyyy-MM-dd');

        try {
            const { data, error } = await supabase
                .from('task_logs')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', dateStr)
                .order('created_at');

            if (error) throw error;
            setTodayTasks(data as TaskLog[]);
        } catch (error) {
            console.error('Erro ao buscar task logs:', error);
        }
    }, [user, selectedDate, supabase, setTodayTasks]);

    // Criar logs do dia baseado nas rotinas - IDEMPOTENTE E ROBUSTO
    const initializeDayTasks = async (routines: { id: string; task_name: string }[]) => {
        if (!user) return;

        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        // 1. Buscar quais rotinas JÁ têm log hoje
        const { data: existingLogs, error: fetchError } = await supabase
            .from('task_logs')
            .select('routine_id')
            .eq('user_id', user.id)
            .eq('date', dateStr);

        if (fetchError) {
            console.error('Erro ao verificar logs existentes:', fetchError);
            return;
        }

        const existingRoutineIds = new Set(existingLogs?.map((l: { routine_id: string }) => l.routine_id));

        // 2. Identificar quais rotinas faltam criar log
        const missingRoutines = routines.filter(r => !existingRoutineIds.has(r.id));

        if (missingRoutines.length === 0) return;

        console.log(`Criando ${missingRoutines.length} logs que faltavam para hoje...`);

        // 3. Criar apenas os logs faltantes
        const logs = missingRoutines.map((r) => ({
            user_id: user.id,
            routine_id: r.id,
            date: dateStr,
            task_name: r.task_name,
            status: 'pending' as TaskStatus,
        }));

        const { error: insertError } = await supabase
            .from('task_logs')
            .insert(logs);

        if (insertError) throw insertError;

        // 4. Forçar atualização da lista para refletir os novos itens
        await fetchTaskLogs();
    };

    // Atualizar status de uma tarefa
    const setTaskStatus = async (taskId: string, status: TaskStatus) => {
        const { error } = await supabase
            .from('task_logs')
            .update({
                status,
                completed_at: status === 'done' ? new Date().toISOString() : null,
                completed_by: user?.id,
            })
            .eq('id', taskId);

        if (error) throw error;
        updateTaskStatus(taskId, status);
    };

    // Marcar subtarefa como completa
    const toggleSubtask = async (taskId: string, subtaskId: string) => {
        const task = todayTasks.find((t) => t.id === taskId);
        if (!task) return;

        const completed = task.subtasks_completed || [];
        const isCompleted = completed.includes(subtaskId);
        const newCompleted = isCompleted
            ? completed.filter((id) => id !== subtaskId)
            : [...completed, subtaskId];

        const { error } = await supabase
            .from('task_logs')
            .update({ subtasks_completed: newCompleted })
            .eq('id', taskId);

        if (error) throw error;
        await fetchTaskLogs();
    };

    // Calcular progresso do dia
    const progress = todayTasks.length > 0
        ? Math.round((todayTasks.filter((t) => t.status === 'done').length / todayTasks.length) * 100)
        : 0;

    // Próxima tarefa pendente
    const nextTask = todayTasks.find((t) => t.status === 'pending');

    return {
        todayTasks,
        progress,
        nextTask,
        fetchTaskLogs,
        initializeDayTasks,
        setTaskStatus,
        toggleSubtask,
    };
}
