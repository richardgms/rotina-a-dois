'use client';

import { format, isToday, isSameMonth, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn, getCompletionBgColor } from '@/lib/utils';

interface DayData {
    date: Date;
    percentage: number;
    isPaused?: boolean;
}

interface MonthViewProps {
    month: Date;
    daysData: Map<string, DayData>;
    onDayClick: (date: Date) => void;
}

export function MonthView({ month, daysData, onDayClick }: MonthViewProps) {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div>
            {/* Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((date) => {
                    const dateKey = format(date, 'yyyy-MM-dd');
                    const dayData = daysData.get(dateKey);
                    const inMonth = isSameMonth(date, month);
                    const today = isToday(date);

                    return (
                        <button
                            key={dateKey}
                            onClick={() => onDayClick(date)}
                            disabled={!inMonth}
                            className={cn(
                                'aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors',
                                !inMonth && 'opacity-30',
                                today && 'ring-2 ring-primary',
                                dayData?.isPaused && 'bg-muted',
                                dayData && !dayData.isPaused && getCompletionBgColor(dayData.percentage),
                                dayData && !dayData.isPaused && 'text-white',
                                !dayData && inMonth && 'hover:bg-accent'
                            )}
                        >
                            {format(date, 'd')}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
