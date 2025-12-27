'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { WeekView } from '@/components/calendar/WeekView';
import { WeekSkeleton } from '@/components/calendar/WeekSkeleton';
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
    }, [weekKey, fetchRangeData]);

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
        <PageContainer className="flex flex-col h-[calc(100vh-8rem)] !p-0 md:!p-6">
            {isLoading ? (
                <WeekSkeleton />
            ) : (
                <>
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b flex flex-col items-center mb-0 md:bg-transparent md:backdrop-blur-none md:border-none md:static">
                        <div className="flex items-center justify-between w-full max-w-xs mb-1">
                            <Button variant="ghost" size="icon" onClick={() => navigateWeek('prev')} className="h-8 w-8 hover:bg-transparent">
                                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                            </Button>

                            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                                {format(weekStart, 'MMMM yyyy', { locale: ptBR })}
                            </span>

                            <Button variant="ghost" size="icon" onClick={() => navigateWeek('next')} className="h-8 w-8 hover:bg-transparent">
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <h1 className="text-xl font-bold capitalize text-center">
                                {format(weekStart, "d", { locale: ptBR })}
                            </h1>
                            <span className="text-muted-foreground text-lg">-</span>
                            <h1 className="text-xl font-bold capitalize text-center">
                                {format(weekEnd, "d 'de' MMM", { locale: ptBR })}
                            </h1>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto w-full px-4 pt-4 md:px-0 scroll-smooth">
                        <WeekView days={dayData} onDayClick={handleDayClick} />
                    </div>
                </>
            )}
        </PageContainer>
    );
}
