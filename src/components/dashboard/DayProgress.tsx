'use client';

import { Progress } from '@/components/ui/progress';
import { cn, getCompletionColor } from '@/lib/utils';

interface DayProgressProps {
    percentage: number;
    totalTasks: number;
    completedTasks: number;
}

export function DayProgress({ percentage, totalTasks, completedTasks }: DayProgressProps) {
    return (
        <div className="relative pt-6 pb-2">
            <div className="flex justify-between items-end mb-2">
                <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Progresso da Rotina</span>
                    <span className="text-2xl font-bold">{percentage}%</span>
                </div>
                <div className="text-right">
                    <span className="text-sm font-medium text-foreground">{completedTasks}/{totalTasks}</span>
                    <span className="text-xs text-muted-foreground ml-1">tarefas</span>
                </div>
            </div>

            {/* Premium Progress Bar */}
            <div className="h-3 w-full rounded-full bg-secondary/30 relative overflow-hidden ring-1 ring-white/5">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                        percentage >= 80 ? "bg-gradient-to-r from-green-600 to-green-400" :
                            percentage >= 50 ? "bg-gradient-to-r from-yellow-600 to-yellow-400" :
                                "bg-gradient-to-r from-red-600 to-red-400"
                    )}
                    style={{ width: `${percentage}%` }}
                >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[shimmer_2s_infinite]" />
                </div>
            </div>
        </div>
    );
}
