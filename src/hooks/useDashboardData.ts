import { useEffect, useRef, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRoutineStore } from '@/stores/routineStore';
import { useTaskLogs } from '@/hooks/useTaskLogs';
import type { Routine, TaskLog, DailyStatus, User } from '@/types';
import { checkIsToday } from '@/lib/utils';

interface UseDashboardDataProps {
    user: User | null;
    selectedDate: Date;
}

export function useDashboardData({ user, selectedDate }: UseDashboardDataProps) {
    const supabase = getSupabaseClient();
    const { initializeDayTasks } = useTaskLogs();
    const hasFetchedRef = useRef(false);
    const lastFetchDateRef = useRef<string | null>(null);
    const [isLoadingLocal, setIsLoadingLocal] = useState(true);
    const isToday = checkIsToday(selectedDate);

    // Resetar fetch quando a data mudar
    useEffect(() => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        if (lastFetchDateRef.current !== dateStr) {
            hasFetchedRef.current = false;
            lastFetchDateRef.current = dateStr;
        }
    }, [selectedDate]);

    const loadDashboardData = useCallback(async () => {
        if (!user) return;

        // Evitar loop: se já buscou para esta data/user, não busca de novo
        if (hasFetchedRef.current) return;

        hasFetchedRef.current = true;
        setIsLoadingLocal(true);

        try {
            const todayStr = format(selectedDate, 'yyyy-MM-dd');
            const dayOfWeek = selectedDate.getDay();

            const [routinesResult, taskLogsResult, statusResult] = await Promise.all([
                supabase
                    .from('routines')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('day_of_week', dayOfWeek)
                    .eq('is_active', true)
                    .order('sort_order'),
                supabase
                    .from('task_logs')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('date', todayStr),
                supabase
                    .from('daily_status')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('date', todayStr)
                    .maybeSingle()
            ]);

            if (routinesResult.error) console.error('Erro routines:', routinesResult.error);
            if (taskLogsResult.error) console.error('Erro taskLogs:', taskLogsResult.error);
            if (statusResult.error) console.error('Erro status:', statusResult.error);

            const routines = (routinesResult.data || []) as Routine[];
            const tasks = (taskLogsResult.data || []) as TaskLog[];

            // Atualizar Stores
            useRoutineStore.getState().setRoutines(routines as Routine[]);
            useRoutineStore.getState().setTodayTasks(tasks as TaskLog[]);
            useRoutineStore.getState().setDailyStatus(statusResult.data as DailyStatus | null);

            // Initialize day tasks SEQUENTIALLY if needed
            if (routines.length > 0 && tasks.length === 0 && isToday) {
                await initializeDayTasks(routines as Routine[]);
            }

        } catch (error) {
            console.error('Dashboard: ERRO nos fetches:', error);
            hasFetchedRef.current = false;
        } finally {
            setIsLoadingLocal(false);
            useRoutineStore.getState().setLoading(false);
        }
    }, [user, selectedDate, supabase, initializeDayTasks, isToday]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    return {
        isLoading: isLoadingLocal,
        dailyStatus: useRoutineStore((state) => state.dailyStatus),
        refetch: async () => {
            hasFetchedRef.current = false;
            await loadDashboardData();
        }
    };
}
