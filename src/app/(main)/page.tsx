'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CloudRain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { DayProgress } from '@/components/dashboard/DayProgress';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { FocusMode } from '@/components/dashboard/FocusMode';
import { PartnerCard } from '@/components/dashboard/PartnerCard';
import { EnergyMoodPicker } from '@/components/dashboard/EnergyMoodPicker';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { useAuth } from '@/hooks/useAuth';
import { useRoutines } from '@/hooks/useRoutines';
import { useTaskLogs } from '@/hooks/useTaskLogs';
import { useDailyStatus } from '@/hooks/useDailyStatus';
import { useRoutineStore } from '@/stores/routineStore';
import { useUIStore } from '@/stores/uiStore';
import { formatDateExtended, checkIsToday } from '@/lib/utils';
import { ENERGY_LABELS, MOOD_LABELS } from '@/types';
import { addDays, subDays, format } from 'date-fns';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function DashboardPage() {
    const { partner, user, isLoading } = useAuth();
    const { routinesForDay, isLoading: routinesLoading } = useRoutines();
    const { todayTasks, progress, nextTask, fetchTaskLogs, initializeDayTasks, setTaskStatus } = useTaskLogs();
    const { fetchDailyStatus, saveDailyStatus, activateDifficultDay } = useDailyStatus();
    const { selectedDate: rawSelectedDate, setSelectedDate, dailyStatus, isFocusMode } = useRoutineStore();
    const { isEnergyMoodOpen, openEnergyMood, closeEnergyMood } = useUIStore();

    // Ensure selectedDate is a valid Date object (persistence may store it as string)
    const selectedDate = new Date(rawSelectedDate);

    const router = useRouter();
    const isToday = checkIsToday(selectedDate);



    // Proteção de rota no lado do cliente (fail-safe)
    useEffect(() => {
        if (!isLoading && !user) {
            if (!isLoading && !user) {
                router.push('/login');
            }
        }
    }, [user, isLoading, router]);

    // Controle para evitar loop infinito de fetches
    const hasFetchedRef = React.useRef(false);
    const lastFetchDateRef = React.useRef<string | null>(null);

    // Resetar fetch quando a data mudar
    useEffect(() => {
        const dateStr = format(new Date(rawSelectedDate), 'yyyy-MM-dd');
        if (lastFetchDateRef.current !== dateStr) {
            if (lastFetchDateRef.current !== dateStr) {
                hasFetchedRef.current = false;
                lastFetchDateRef.current = dateStr;
            }
        }
    }, [rawSelectedDate]);

    // Carregar TODOS os dados em paralelo - OTIMIZADO (Debug Mode)
    useEffect(() => {
        async function loadDashboardData() {
            if (!user) {
                // console.log('Dashboard: sem user, abortando fetch');
                return;
            }

            // Evitar loop: se já buscou para esta data/user, não busca de novo
            if (hasFetchedRef.current) {
                return;
            }

            hasFetchedRef.current = true;
            hasFetchedRef.current = true;

            try {
                // Buscar diretamente do Supabase, sem depender dos hooks
                const supabase = getSupabaseClient();
                // Ensure we use the date that triggered the change (derived from rawSelectedDate)
                const targetDate = new Date(rawSelectedDate);
                const today = format(targetDate, 'yyyy-MM-dd');
                const dayOfWeek = targetDate.getDay();



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
                        .eq('date', today),
                    supabase
                        .from('daily_status')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('date', today)
                        .maybeSingle()
                ]);


                if (routinesResult.error) console.error('Erro routines:', routinesResult.error);
                if (taskLogsResult.error) console.error('Erro taskLogs:', taskLogsResult.error);
                if (statusResult.error) console.error('Erro status:', statusResult.error);

                const routines = routinesResult.data || [];
                const tasks = taskLogsResult.data || [];

                useRoutineStore.getState().setRoutines(routines as any);
                useRoutineStore.getState().setTodayTasks(tasks as any);
                useRoutineStore.getState().setDailyStatus(statusResult.data || null);

                useRoutineStore.getState().setLoading(false);
                setDailyStatusLoaded(true);

                // Initialize day tasks SEQUENTIALLY if needed
                if (routines.length > 0 && tasks.length === 0 && isToday) {
                    await initializeDayTasks(routines as any);
                }

            } catch (error) {
                console.error('Dashboard: ERRO nos fetches:', error);
                hasFetchedRef.current = false;
                useRoutineStore.getState().setLoading(false);
            }
        }

        loadDashboardData();
    }, [user, rawSelectedDate, isToday, initializeDayTasks]); // Added isToday and initializeDayTasks to dependencies

    // Mostrar picker de energia/humor - só uma vez por dia por sessão
    const [dailyStatusLoaded, setDailyStatusLoaded] = useState(false);
    const alreadyAskedRef = React.useRef(false);

    useEffect(() => {
        // Só abre o modal se: É hoje, já carregou o status, status está vazio, e ainda não perguntou nesta sessão
        if (isToday && dailyStatusLoaded && !dailyStatus?.energy_level && !alreadyAskedRef.current) {
            alreadyAskedRef.current = true;
            openEnergyMood();
        }
    }, [isToday, dailyStatusLoaded, dailyStatus, openEnergyMood]);

    const navigateDay = (direction: 'prev' | 'next') => {
        const newDate = direction === 'prev'
            ? subDays(selectedDate, 1)
            : addDays(selectedDate, 1);
        setSelectedDate(newDate);
    };

    if (routinesLoading && routinesForDay.length === 0) {
        return <DashboardSkeleton />;
    }

    const completedTasks = todayTasks.filter((t) => t.status === 'done').length;

    return (
        <PageContainer>
            {/* Navegação de data */}
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigateDay('prev')}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="text-center">
                    <p className="font-semibold capitalize">{formatDateExtended(selectedDate)}</p>
                    {!isToday && (
                        <Button
                            variant="link"
                            size="sm"
                            className="text-xs"
                            onClick={() => setSelectedDate(new Date())}
                        >
                            Voltar para hoje
                        </Button>
                    )}
                </div>

                <Button variant="ghost" size="icon" onClick={() => navigateDay('next')}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Status energia/humor */}
            {dailyStatus?.energy_level && dailyStatus?.mood && (
                <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                    <span>{ENERGY_LABELS[dailyStatus.energy_level].icon} {ENERGY_LABELS[dailyStatus.energy_level].label}</span>
                    <span>{MOOD_LABELS[dailyStatus.mood].icon} {MOOD_LABELS[dailyStatus.mood].label}</span>
                </div>
            )}

            {/* Progresso */}
            {todayTasks.length > 0 && (
                <div className="mb-6">
                    <DayProgress
                        percentage={progress}
                        totalTasks={todayTasks.length}
                        completedTasks={completedTasks}
                    />
                </div>
            )}

            {/* Botão dia difícil */}
            {isToday && todayTasks.length > 0 && (
                <Button
                    variant="outline"
                    className="w-full mb-4"
                    onClick={() => activateDifficultDay()}
                >
                    <CloudRain className="h-4 w-4 mr-2" />
                    Dia difícil
                </Button>
            )}

            {/* Modo foco ou lista de tarefas */}
            {isFocusMode ? (
                <FocusMode
                    nextTask={nextTask}
                    routine={routinesForDay.find((r) => r.id === nextTask?.routine_id)}
                    onComplete={() => nextTask && setTaskStatus(nextTask.id, 'done')}
                />
            ) : (
                <>
                    {/* Botão modo foco */}
                    {todayTasks.length > 0 && (
                        <div className="mb-4">
                            <FocusMode
                                nextTask={nextTask}
                                routine={routinesForDay.find((r) => r.id === nextTask?.routine_id)}
                                onComplete={() => nextTask && setTaskStatus(nextTask.id, 'done')}
                            />
                        </div>
                    )}

                    {/* Lista de tarefas */}
                    {todayTasks.length === 0 ? (
                        <EmptyState
                            icon="📝"
                            title="Nenhuma tarefa para hoje"
                            description="Configure sua rotina para começar"
                            action={{
                                label: 'Criar rotina',
                                onClick: () => router.push('/routines'),
                            }}
                        />
                    ) : (
                        <div className="space-y-3">
                            {todayTasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    routine={routinesForDay.find((r) => r.id === task.routine_id)}
                                    onStatusChange={(status) => setTaskStatus(task.id, status)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Card do parceiro */}
            {partner && (
                <div className="mt-6">
                    <PartnerCard
                        partner={partner}
                        status={null} // TODO: buscar status do parceiro
                        progress={0} // TODO: buscar progresso do parceiro
                    />
                </div>
            )}

            {/* Modal energia/humor */}
            <EnergyMoodPicker
                open={isEnergyMoodOpen}
                onClose={closeEnergyMood}
                onSave={(energy, mood) => {
                    saveDailyStatus(energy, mood);
                    closeEnergyMood();
                }}
            />
        </PageContainer>
    );
}
