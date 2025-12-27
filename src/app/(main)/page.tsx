'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CloudRain, RefreshCw, AlertTriangle } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { DayProgress } from '@/components/dashboard/DayProgress';
import { PartnerCard } from '@/components/dashboard/PartnerCard';
import { EnergyMoodPicker } from '@/components/dashboard/EnergyMoodPicker';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TaskList } from '@/components/dashboard/TaskList';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ENERGY_LABELS, MOOD_LABELS } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useRoutines } from '@/hooks/useRoutines';
import { useTaskLogs } from '@/hooks/useTaskLogs';
import { useDailyStatus } from '@/hooks/useDailyStatus';
import { useRoutineStore } from '@/stores/routineStore';
import { useUIStore } from '@/stores/uiStore';
import { useDashboardData } from '@/hooks/useDashboardData';
import { checkIsToday } from '@/lib/utils';

export default function DashboardPage() {
    const router = useRouter();
    const { partner, user, isLoading: authLoading } = useAuth();

    // Store e Estado Global
    const { selectedDate: rawSelectedDate, setSelectedDate, isFocusMode } = useRoutineStore();
    const selectedDate = new Date(rawSelectedDate);
    const isToday = checkIsToday(selectedDate);

    // Dados e Ações - CORREÇÃO 4: Removido authLoading, usa user diretamente
    const { isLoading: dashboardLoading, dailyStatus, error, timedOut, refetch } = useDashboardData({ user, selectedDate });
    const { routinesForDay } = useRoutines();
    const { todayTasks, progress, nextTask, setTaskStatus } = useTaskLogs();
    const { saveDailyStatus, activateDifficultDay } = useDailyStatus();
    const { isEnergyMoodOpen, openEnergyMood, closeEnergyMood } = useUIStore();

    // Proteção de rota
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Modal de Humor (apenas 1x por sessão)
    const [dailyStatusLoaded, setDailyStatusLoaded] = useState(false);
    const alreadyAskedRef = useRef(false);

    useEffect(() => {
        if (!dashboardLoading) setDailyStatusLoaded(true);
    }, [dashboardLoading]);

    useEffect(() => {
        if (isToday && dailyStatusLoaded && !dailyStatus?.energy_level && !alreadyAskedRef.current && !dashboardLoading) {
            alreadyAskedRef.current = true;
            openEnergyMood();
        }
    }, [isToday, dailyStatusLoaded, dailyStatus, openEnergyMood, dashboardLoading]);

    // Estado de Erro ou Timeout
    if (error || timedOut) {
        return (
            <PageContainer className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <Card className="max-w-md w-full">
                    <CardContent className="flex flex-col items-center gap-4 py-8">
                        <AlertTriangle className="h-12 w-12 text-destructive" />
                        <h2 className="text-lg font-semibold text-center">Ops! Algo deu errado</h2>
                        <p className="text-sm text-muted-foreground text-center">
                            {error || 'Não foi possível carregar os dados. Por favor, tente novamente.'}
                        </p>
                        <Button onClick={() => refetch()} className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Tentar novamente
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                            Recarregar página
                        </Button>
                    </CardContent>
                </Card>
            </PageContainer>
        );
    }

    // Loading State
    if (dashboardLoading && routinesForDay.length === 0) {
        return <DashboardSkeleton />;
    }

    const completedTasks = todayTasks.filter((t) => t.status === 'done').length;

    return (
        <PageContainer className="flex flex-col h-[calc(100vh-8rem)] !p-0 md:!p-6">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b flex flex-col items-center mb-0 md:bg-transparent md:backdrop-blur-none md:border-none md:static">
                <DashboardHeader
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                // dailyStatus and difficultDay logic moved to body
                />
            </div>

            <div className="flex-1 overflow-y-auto w-full px-4 pt-6 md:px-0 scroll-smooth pb-20">
                {/* Status Section */}
                <div className="flex flex-col gap-2 mb-2">
                    {dailyStatus?.energy_level && dailyStatus?.mood && (
                        <div className="flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground bg-muted/30 py-1.5 rounded-full mx-auto px-6">
                            <span>{ENERGY_LABELS[dailyStatus.energy_level].icon} {ENERGY_LABELS[dailyStatus.energy_level].label}</span>
                            <div className="w-1 h-1 rounded-full bg-border" />
                            <span>{MOOD_LABELS[dailyStatus.mood].icon} {MOOD_LABELS[dailyStatus.mood].label}</span>
                        </div>
                    )}

                    {/* Botão dia difícil */}
                    {isToday && todayTasks.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground hover:text-primary hover:bg-transparent self-center h-6"
                            onClick={activateDifficultDay}
                        >
                            <CloudRain className="h-3 w-3 mr-1.5" />
                            Marcar como dia difícil
                        </Button>
                    )}
                </div>

                {/* Progresso Geral */}
                {todayTasks.length > 0 && (
                    <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <DayProgress
                            percentage={progress}
                            totalTasks={todayTasks.length}
                            completedTasks={completedTasks}
                        />
                    </div>
                )}

                {/* Lista de Tarefas / Modo Foco */}
                <TaskList
                    tasks={todayTasks}
                    routines={routinesForDay}
                    isFocusMode={isFocusMode}
                    onTaskStatusChange={setTaskStatus}
                    nextTask={nextTask}
                />

                {/* Card do Parceiro */}
                {partner && (
                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-backwards">
                        <PartnerCard
                            partner={partner}
                            status={null}
                            progress={0}
                        />
                    </div>
                )}
            </div>

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
