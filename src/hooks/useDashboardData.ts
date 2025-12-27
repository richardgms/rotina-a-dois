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

// CORREÇÃO 4: Removido authLoading - usar user do localStorage diretamente
const DATA_LOADING_TIMEOUT_MS = 15000; // 15 segundos

export function useDashboardData({ user, selectedDate }: UseDashboardDataProps) {
    const supabase = getSupabaseClient();
    const { initializeDayTasks } = useTaskLogs();
    const hasFetchedRef = useRef(false);
    const lastFetchDateRef = useRef<string | null>(null);
    const [isLoadingLocal, setIsLoadingLocal] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timedOut, setTimedOut] = useState(false);
    const [dataFetchStarted, setDataFetchStarted] = useState(false);
    const isToday = checkIsToday(selectedDate);

    // Resetar fetch quando a data mudar
    useEffect(() => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        if (lastFetchDateRef.current !== dateStr) {
            hasFetchedRef.current = false;
            lastFetchDateRef.current = dateStr;
            setError(null);
            setTimedOut(false);
            setDataFetchStarted(false);
        }
    }, [selectedDate]);

    // Timeout de segurança: só inicia se dataFetchStarted = true
    useEffect(() => {
        if (!dataFetchStarted || !isLoadingLocal) return;

        console.log('[useDashboardData] Iniciando timeout de', DATA_LOADING_TIMEOUT_MS / 1000, 'segundos');

        const timeout = setTimeout(() => {
            if (isLoadingLocal) {
                console.error('[useDashboardData] TIMEOUT: Carregamento de dados demorou demais');
                setIsLoadingLocal(false);
                setTimedOut(true);
                setError('Timeout ao carregar dados. Por favor, tente novamente.');
                useRoutineStore.getState().setLoading(false);
            }
        }, DATA_LOADING_TIMEOUT_MS);

        return () => clearTimeout(timeout);
    }, [dataFetchStarted, isLoadingLocal]);

    const loadDashboardData = useCallback(async () => {
        // CORREÇÃO 4: Usar user do store diretamente (já reidratado do localStorage)
        if (!user) {
            console.log('[useDashboardData] Sem usuário, parando loading');
            setIsLoadingLocal(false);
            return;
        }

        // Evitar loop: se já buscou para esta data/user, não busca de novo
        if (hasFetchedRef.current) return;

        hasFetchedRef.current = true;
        setIsLoadingLocal(true);
        setDataFetchStarted(true);
        setError(null);

        try {
            console.log('[useDashboardData] Iniciando carregamento para user:', user.id);
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

            if (routinesResult.error) {
                console.error('[useDashboardData] Erro routines:', routinesResult.error);
                setError('Erro ao carregar rotinas: ' + routinesResult.error.message);
                return;
            }
            if (taskLogsResult.error) {
                console.error('[useDashboardData] Erro taskLogs:', taskLogsResult.error);
                setError('Erro ao carregar tarefas: ' + taskLogsResult.error.message);
                return;
            }
            if (statusResult.error) {
                console.error('[useDashboardData] Erro status:', statusResult.error);
            }

            const routines = (routinesResult.data || []) as Routine[];
            const tasks = (taskLogsResult.data || []) as TaskLog[];

            console.log('[useDashboardData] Dados recebidos:', { routines: routines.length, tasks: tasks.length });

            // Atualizar Stores
            useRoutineStore.getState().setRoutines(routines as Routine[]);
            useRoutineStore.getState().setTodayTasks(tasks as TaskLog[]);
            useRoutineStore.getState().setDailyStatus(statusResult.data as DailyStatus | null);

            // Initialize day tasks SEQUENTIALLY if needed
            if (routines.length > 0 && tasks.length === 0 && isToday) {
                await initializeDayTasks(routines as Routine[]);
            }

            console.log('[useDashboardData] Dados carregados com sucesso');

        } catch (err) {
            console.error('[useDashboardData] ERRO nos fetches:', err);
            setError('Erro ao carregar dados: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
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
        error,
        timedOut,
        dailyStatus: useRoutineStore((state) => state.dailyStatus),
        refetch: async () => {
            hasFetchedRef.current = false;
            setError(null);
            setTimedOut(false);
            setDataFetchStarted(false);
            setIsLoadingLocal(true);
            await loadDashboardData();
        }
    };
}
