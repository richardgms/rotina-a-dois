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
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso do dia</span>
                <span className={cn('font-semibold', getCompletionColor(percentage))}>
                    {completedTasks}/{totalTasks} tarefas ({percentage}%)
                </span>
            </div>
            <Progress value={percentage} className="h-3" />
        </div>
    );
}
