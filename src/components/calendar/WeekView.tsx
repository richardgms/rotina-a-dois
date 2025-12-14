'use client';

import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { cn, getCompletionBgColor } from '@/lib/utils';

interface DayData {
    date: Date;
    taskCount: number;
    completedCount: number;
    energy?: string;
}

interface WeekViewProps {
    days: DayData[];
    onDayClick: (date: Date) => void;
}

export function WeekView({ days, onDayClick }: WeekViewProps) {
    return (
        <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
                const percentage = day.taskCount > 0
                    ? Math.round((day.completedCount / day.taskCount) * 100)
                    : 0;
                const today = isToday(day.date);

                return (
                    <Card
                        key={day.date.toISOString()}
                        className={cn(
                            'p-2 cursor-pointer hover:bg-accent transition-colors text-center',
                            today && 'ring-2 ring-primary'
                        )}
                        onClick={() => onDayClick(day.date)}
                    >
                        <p className="text-xs text-muted-foreground">
                            {format(day.date, 'EEE', { locale: ptBR })}
                        </p>
                        <p className="text-lg font-bold">{format(day.date, 'd')}</p>

                        {day.taskCount > 0 && (
                            <>
                                <div
                                    className={cn(
                                        'h-1.5 w-full rounded-full mt-1',
                                        getCompletionBgColor(percentage)
                                    )}
                                    style={{ opacity: percentage / 100 || 0.2 }}
                                />
                                <p className="text-xs mt-1">{percentage}%</p>
                            </>
                        )}

                        {day.energy && (
                            <p className="text-xs mt-1">
                                {day.energy === 'high' ? '🔋' : day.energy === 'medium' ? '🔋' : '🪫'}
                            </p>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
