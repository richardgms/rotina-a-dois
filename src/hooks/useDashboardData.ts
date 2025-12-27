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

const LOADING_TIMEOUT_MS = 10000; // 10 segundos

export function useDashboardData({ user, selectedDate }: UseDashboardDataProps) {
    const supabase = getSupabaseClient();
    const { initializeDayTasks } = useTaskLogs();
    const hasFetchedRef = useRef(false);
    const lastFetchDateRef = useRef<string | null>(null);
    const [isLoadingLocal, setIsLoadingLocal] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timedOut, setTimedOut] = useState(false);
    const isToday = checkIsToday(selectedDate);

    // Resetar fetch quando a data mudar
    useEffect(() => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        if (lastFetchDateRef.current !== dateStr) {
            hasFetchedRef.current = false;
            lastFetchDateRef.current = dateStr;
            setError(null);
            setTimedOut(false);
        }
    }, [selectedDate]);

    // Timeout de segurança: se loading demorar mais de 10s, forçar fim
    useEffect(() => {
        if (!isLoadingLocal) return;

        const timeout = setTimeout(() => {
            if (isLoadingLocal) {
                console.error('[useDashboardData] TIMEOUT: Loading demorou mais de 10 segundos');
                setIsLoadingLocal(false);
                setTimedOut(true);
                setError('Timeout ao carregar dados. Por favor, recarregue a página.');
                useRoutineStore.getState().setLoading(false);
            }
        }, LOADING_TIMEOUT_MS);

        return () => clearTimeout(timeout);
    }, [isLoadingLocal]);

    const loadDashboardData = useCallback(async () => {
        // Se não tem usuário, não tenta carregar mas também não fica loading infinito
        if (!user) {
            console.log('[useDashboardData] Sem usuário, aguardando autenticação...');
            // Não setar isLoadingLocal = false aqui, deixar o timeout cuidar
            return;
        }

        // Evitar loop: se já buscou para esta data/user, não busca de novo
        if (hasFetchedRef.current) return;

        hasFetchedRef.current = true;
        setIsLoadingLocal(true);
        setError(null);

        try {
            console.log('[useDashboardData] Iniciando carregamento de dados...');
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
                setError('Erro ao carregar rotinas');
            }
            if (taskLogsResult.error) {
                console.error('[useDashboardData] Erro taskLogs:', taskLogsResult.error);
                setError('Erro ao carregar tarefas');
            }
            if (statusResult.error) {
                console.error('[useDashboardData] Erro status:', statusResult.error);
            }

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

            console.log('[useDashboardData] Dados carregados com sucesso');

        } catch (err) {
            console.error('[useDashboardData] ERRO nos fetches:', err);
            setError('Erro ao carregar dados do dashboard');
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
            await loadDashboardData();
        }
    };
}
