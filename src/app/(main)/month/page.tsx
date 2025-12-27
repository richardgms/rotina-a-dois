'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { MonthView } from '@/components/calendar/MonthView';
import { MonthSkeleton } from '@/components/calendar/MonthSkeleton';
import { useRoutineStore } from '@/stores/routineStore';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useRouter } from 'next/navigation';

export default function MonthPage() {
    const [month, setMonth] = useState(new Date());
    const { setSelectedDate } = useRoutineStore();
    const { daysData, fetchRangeData, isLoading } = useCalendarData();
    const router = useRouter();

    // Calculate date range for display (including partial weeks)
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    // Use month timestamp as stable dependency
    const monthKey = format(month, 'yyyy-MM');

    useEffect(() => {
        fetchRangeData(calendarStart, calendarEnd);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthKey, fetchRangeData]);

    // Convert daysData to the format expected by MonthView
    const monthDaysData = useMemo(() => {
        const result = new Map<string, { date: Date; percentage: number; taskCount: number; isPaused?: boolean }>();
        daysData.forEach((stats, dateKey) => {
            result.set(dateKey, {
                date: stats.date,
                percentage: stats.percentage,
                taskCount: stats.taskCount || 0,
                isPaused: false,
            });
        });
        return result;
    }, [daysData]);

    const navigateMonth = (direction: 'prev' | 'next') => {
        setMonth(direction === 'prev' ? subMonths(month, 1) : addMonths(month, 1));
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        router.push('/');
    };

    return (
        <PageContainer className="flex flex-col h-[calc(100vh-8rem)] !p-0 md:!p-6">
            {isLoading ? (
                <MonthSkeleton />
            ) : (
                <>
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b flex flex-col items-center mb-0 md:bg-transparent md:backdrop-blur-none md:border-none md:static">
                        <div className="flex items-center justify-between w-full max-w-xs mb-1">
                            <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')} className="h-8 w-8 hover:bg-transparent">
                                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                            </Button>

                            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                                {format(month, 'yyyy', { locale: ptBR })}
                            </span>

                            <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')} className="h-8 w-8 hover:bg-transparent">
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </div>

                        <h1 className="text-xl font-bold capitalize text-center mb-2">
                            {format(month, 'MMMM', { locale: ptBR })}
                        </h1>
                    </div>

                    <div className="flex-1 overflow-y-auto w-full px-4 pt-4 md:px-0 scroll-smooth">
                        <MonthView month={month} daysData={monthDaysData} onDayClick={handleDayClick} />

                        {/* Legenda (Refinada) */}
                        <div className="flex justify-center gap-6 mt-8 mb-4 text-[10px] text-muted-foreground uppercase tracking-widest font-medium opacity-70">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                <span>Excelente</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                                <span>Bom</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                                <span>Atenção</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </PageContainer>
    );
}
