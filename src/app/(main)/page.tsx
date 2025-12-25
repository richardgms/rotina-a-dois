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
import { useAuth } from '@/hooks/useAuth';
import { useRoutines } from '@/hooks/useRoutines';
import { useTaskLogs } from '@/hooks/useTaskLogs';
import { useDailyStatus } from '@/hooks/useDailyStatus';
import { useRoutineStore } from '@/stores/routineStore';
import { useUIStore } from '@/stores/uiStore';
import { formatDateExtended, checkIsToday } from '@/lib/utils';
import { ENERGY_LABELS, MOOD_LABELS } from '@/types';
import { addDays, subDays } from 'date-fns';

export default function DashboardPage() {
    const { partner, user, isLoading } = useAuth();
    const { routinesForDay, fetchRoutines, isLoading: routinesLoading } = useRoutines();
    const { todayTasks, progress, nextTask, fetchTaskLogs, initializeDayTasks, setTaskStatus } = useTaskLogs();
    const { fetchDailyStatus, saveDailyStatus, activateDifficultDay } = useDailyStatus();
    const { selectedDate, setSelectedDate, dailyStatus, isFocusMode } = useRoutineStore();
    const { isEnergyMoodOpen, openEnergyMood, closeEnergyMood } = useUIStore();

    const router = useRouter();
    const isToday = checkIsToday(selectedDate);

    // Proteção de rota no lado do cliente (fail-safe)
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    // Carregar dados
    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    useEffect(() => {
        fetchTaskLogs(selectedDate);
        fetchDailyStatus(selectedDate);
    }, [selectedDate, fetchTaskLogs, fetchDailyStatus]);

    // Inicializar tarefas do dia
    useEffect(() => {
        if (routinesForDay.length > 0 && todayTasks.length === 0 && isToday) {
            initializeDayTasks(routinesForDay);
        }
    }, [routinesForDay, todayTasks.length, isToday, initializeDayTasks]);
    // Mostrar picker de energia/humor - só uma vez por dia por sessão
    const [dailyStatusLoaded, setDailyStatusLoaded] = useState(false);
    const alreadyAskedRef = React.useRef(false);

    useEffect(() => {
        if (!user) return; // Wait for auth

        setDailyStatusLoaded(false);
        const loadStatus = async () => {
            await fetchDailyStatus(selectedDate);
            setDailyStatusLoaded(true);
        };
        loadStatus();
    }, [selectedDate, fetchDailyStatus, user]);

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

    if (routinesLoading) {
        return <LoadingPage />;
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
