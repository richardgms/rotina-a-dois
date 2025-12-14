'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { WeekView } from '@/components/calendar/WeekView';
import { useRoutineStore } from '@/stores/routineStore';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useRouter } from 'next/navigation';

export default function WeekPage() {
    const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
    const { setSelectedDate } = useRoutineStore();
    const { daysData, fetchRangeData, isLoading } = useCalendarData();
    const router = useRouter();

    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Use stable string key for dependency
    const weekKey = format(weekStart, 'yyyy-MM-dd');

    useEffect(() => {
        fetchRangeData(weekStart, weekEnd);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weekKey]);

    // Build day data from fetched data
    const dayData = days.map((date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const stats = daysData.get(dateKey);
        return {
            date,
            taskCount: stats?.taskCount || 0,
            completedCount: stats?.completedCount || 0,
            energy: stats?.energy,
        };
    });

    const navigateWeek = (direction: 'prev' | 'next') => {
        setWeekStart(direction === 'prev' ? subWeeks(weekStart, 1) : addWeeks(weekStart, 1));
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        router.push('/');
    };

    return (
        <PageContainer className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={() => navigateWeek('prev')}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <h1 className="text-lg font-semibold capitalize">
                    {format(weekStart, "d 'de' MMM", { locale: ptBR })} - {format(weekEnd, "d 'de' MMM", { locale: ptBR })}
                </h1>

                <Button variant="ghost" size="icon" onClick={() => navigateWeek('next')}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex-1 flex items-center justify-center">
                {isLoading ? (
                    <div className="text-muted-foreground">Carregando...</div>
                ) : (
                    <WeekView days={dayData} onDayClick={handleDayClick} />
                )}
            </div>
        </PageContainer>
    );
}
