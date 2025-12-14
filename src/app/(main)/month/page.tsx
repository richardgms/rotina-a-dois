'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { MonthView } from '@/components/calendar/MonthView';
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
    }, [monthKey]);

    // Convert daysData to the format expected by MonthView
    const monthDaysData = useMemo(() => {
        const result = new Map<string, { date: Date; percentage: number; isPaused?: boolean }>();
        daysData.forEach((stats, dateKey) => {
            result.set(dateKey, {
                date: stats.date,
                percentage: stats.percentage,
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
        <PageContainer className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <h1 className="text-lg font-semibold capitalize">
                    {format(month, 'MMMM yyyy', { locale: ptBR })}
                </h1>

                <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                {isLoading ? (
                    <div className="text-center text-muted-foreground">Carregando...</div>
                ) : (
                    <MonthView month={month} daysData={monthDaysData} onDayClick={handleDayClick} />
                )}

                {/* Legenda */}
                <div className="flex justify-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        <span>&gt;80%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-yellow-500" />
                        <span>50-80%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span>&lt;50%</span>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
