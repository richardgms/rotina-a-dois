'use client';

import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { cn, getCompletionBgColor } from '@/lib/utils';
import { ChevronRight, Zap, Battery, BatteryWarning } from 'lucide-react';

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
        <div className="flex flex-col md:grid md:grid-cols-7 gap-3 w-full max-w-4xl mx-auto pb-6">
            {days.map((day, index) => {
                const percentage = day.taskCount > 0
                    ? Math.round((day.completedCount / day.taskCount) * 100)
                    : 0;
                const today = isToday(day.date);

                // Configuração do ícone de energia
                let EnergyIcon = null;
                let energyColor = '';

                if (day.energy === 'high') {
                    EnergyIcon = Zap;
                    energyColor = 'text-yellow-500 bg-yellow-500/10';
                } else if (day.energy === 'medium') {
                    EnergyIcon = Battery;
                    energyColor = 'text-green-500 bg-green-500/10';
                } else if (day.energy) {
                    EnergyIcon = BatteryWarning;
                    energyColor = 'text-red-500 bg-red-500/10';
                }

                return (
                    <Card
                        key={day.date.toISOString()}
                        className={cn(
                            'cursor-pointer transition-all border-l-[1.5px] relative overflow-hidden group',
                            'flex md:flex-col items-center p-4 gap-4 md:gap-2',
                            'hover:shadow-sm hover:border-primary/50',
                            today ? 'border-l-primary bg-primary/3 shadow-none' : 'border-l-transparent bg-card/20',
                            // Animation classes
                            'animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards'
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => onDayClick(day.date)}
                    >
                        {/* Data */}
                        <div className="flex md:flex-col items-baseline md:items-center gap-2 md:gap-0 min-w-[3.5rem] md:min-w-0">
                            <span className={cn(
                                "text-2xl md:text-3xl font-bold tracking-tight",
                                today ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"
                            )}>
                                {format(day.date, 'dd')}
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider md:text-[0.65rem]">
                                {format(day.date, 'EEE', { locale: ptBR }).slice(0, 3)}
                            </span>
                        </div>

                        {/* Conteúdo Central */}
                        <div className="flex-1 flex flex-col justify-center gap-1.5 w-full">
                            {day.taskCount > 0 ? (
                                <>
                                    <div className="flex justify-between text-xs text-muted-foreground md:hidden font-medium">
                                        <span>{day.completedCount}/{day.taskCount} tarefas</span>
                                        <span className={cn(percentage === 100 ? "text-green-600" : "")}>{percentage}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary/50 overflow-hidden">
                                        <div
                                            className={cn('h-full transition-all duration-1000 ease-out', getCompletionBgColor(percentage))}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-center hidden md:block mt-1 font-medium text-muted-foreground">
                                        {percentage}%
                                    </p>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 group/empty">
                                    <div className="h-8 px-3 rounded-full bg-secondary/30 text-xs font-medium text-muted-foreground flex items-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        Planejar dia
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Ícones e Status */}
                        <div className="flex items-center gap-3 md:gap-1 md:flex-col">
                            {/* Energia */}
                            {EnergyIcon && (
                                <div className={cn("p-1.5 rounded-full shadow-sm", energyColor)}>
                                    <EnergyIcon size={16} fill="currentColor" className="fill-current" />
                                </div>
                            )}

                            {/* Indicador Mobile */}
                            <ChevronRight className={cn(
                                "h-5 w-5 md:hidden transition-transform group-hover:translate-x-1",
                                today ? "text-primary" : "text-muted-foreground/30"
                            )} />
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
