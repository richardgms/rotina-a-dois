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

    // Criar logs do dia baseado nas rotinas
    const initializeDayTasks = async (routines: { id: string; task_name: string }[]) => {
        if (!user) return;

        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        // Verificar se já existem logs para hoje
        const { data: existing } = await supabase
            .from('task_logs')
            .select('id')
            .eq('user_id', user.id)
            .eq('date', dateStr)
            .limit(1);

        if (existing && existing.length > 0) return;

        // Criar logs para cada rotina
        const logs = routines.map((r) => ({
            user_id: user.id,
            routine_id: r.id,
            date: dateStr,
            task_name: r.task_name,
            status: 'pending' as TaskStatus,
        }));

        const { data, error } = await supabase
            .from('task_logs')
            .insert(logs)
            .select();

        if (error) throw error;
        setTodayTasks(data as TaskLog[]);
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
