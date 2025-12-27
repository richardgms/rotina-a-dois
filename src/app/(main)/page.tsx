'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { DayProgress } from '@/components/dashboard/DayProgress';
import { PartnerCard } from '@/components/dashboard/PartnerCard';
import { EnergyMoodPicker } from '@/components/dashboard/EnergyMoodPicker';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TaskList } from '@/components/dashboard/TaskList';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

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

    // Dados e Ações
    const { isLoading: dashboardLoading, dailyStatus } = useDashboardData({ user, selectedDate });
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

    // Loading State
    if (dashboardLoading && routinesForDay.length === 0) {
        return <DashboardSkeleton />;
    }

    const completedTasks = todayTasks.filter((t) => t.status === 'done').length;

    return (
        <PageContainer>
            <DashboardHeader
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                dailyStatus={dailyStatus}
                showDifficultDayButton={isToday && todayTasks.length > 0}
                onDifficultDayClick={activateDifficultDay}
            />

            {/* Progresso Geral */}
            {todayTasks.length > 0 && (
                <div className="mb-6">
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
                <div className="mt-6">
                    <PartnerCard
                        partner={partner}
                        status={null} // Será implementado no futuro via contexto/store de parceiro
                        progress={0}
                    />
                </div>
            )}

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
