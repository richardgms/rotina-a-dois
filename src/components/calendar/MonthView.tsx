'use client';

import { format, isToday, isSameMonth, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';

interface DayData {
    date: Date;
    percentage: number;
    taskCount: number;
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

    const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-muted-foreground/50 py-2 uppercase tracking-wide">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((date, index) => {
                    const dateKey = format(date, 'yyyy-MM-dd');
                    const dayData = daysData.get(dateKey);
                    const inMonth = isSameMonth(date, month);
                    const today = isToday(date);

                    // Cores baseadas no progresso
                    let ringColor = 'ring-transparent';
                    let bgColor = 'bg-transparent';
                    // Dias do mês sem dados = cinza claro/branco (neutro), Dias fora = muted/30
                    let textColor = inMonth ? 'text-foreground/70' : 'text-muted-foreground/30';

                    const hasTasks = dayData && dayData.taskCount > 0;

                    if (hasTasks && !dayData.isPaused && inMonth) {
                        if (dayData.percentage >= 80) {
                            ringColor = 'ring-green-500/30';
                            bgColor = 'bg-green-500/5';
                            textColor = 'text-green-600 dark:text-green-400 font-bold';
                        } else if (dayData.percentage >= 50) {
                            ringColor = 'ring-yellow-500/30';
                            bgColor = 'bg-yellow-500/5';
                            textColor = 'text-yellow-600 dark:text-yellow-400 font-bold';
                        } else {
                            ringColor = 'ring-red-500/30';
                            bgColor = 'bg-red-500/5';
                            textColor = 'text-red-600 dark:text-red-400 font-bold';
                        }
                    } else if (inMonth && !hasTasks) {
                        // Mantém o padrão neutro
                        textColor = 'text-foreground/70 font-normal';
                    }

                    if (today) {
                        ringColor = 'ring-primary/50';
                        bgColor = 'bg-primary/5';
                        textColor = 'text-primary font-bold';
                    }

                    return (
                        <button
                            key={dateKey}
                            onClick={() => onDayClick(date)}
                            disabled={!inMonth}
                            className={cn(
                                'aspect-square rounded-full flex flex-col items-center justify-center text-sm transition-all duration-300 relative group overflow-hidden',
                                textColor,
                                bgColor,
                                'hover:bg-accent ring-[0.5px]',
                                ringColor,
                                !inMonth && 'ring-transparent hover:bg-transparent cursor-default',
                                // Animation
                                'animate-in fade-in zoom-in-50 duration-500 fill-mode-backwards'
                            )}
                            style={{ animationDelay: `${index * 15}ms` }}
                        >
                            <span className="relative z-10">{format(date, 'd')}</span>

                            {/* Glow Effect on Hover */}
                            {inMonth && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
