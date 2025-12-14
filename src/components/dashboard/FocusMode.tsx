'use client';

import { Sparkles, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRoutineStore } from '@/stores/routineStore';
import type { TaskLog, Routine } from '@/types';

interface FocusModeProps {
    nextTask: TaskLog | undefined;
    routine?: Routine;
    onComplete: () => void;
}

export function FocusMode({ nextTask, routine, onComplete }: FocusModeProps) {
    const { isFocusMode, toggleFocusMode } = useRoutineStore();

    if (!isFocusMode) {
        return (
            <Button
                onClick={toggleFocusMode}
                variant="outline"
                className="w-full"
            >
                <Sparkles className="h-4 w-4 mr-2" />
                O que fazer agora?
            </Button>
        );
    }

    if (!nextTask) {
        return (
            <Card className="p-6 text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="font-semibold">Você completou tudo!</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Parabéns pelo dia produtivo!
                </p>
                <Button onClick={toggleFocusMode} variant="outline" className="mt-4">
                    <List className="h-4 w-4 mr-2" />
                    Ver todas as tarefas
                </Button>
            </Card>
        );
    }

    return (
        <Card className="p-6 border-primary">
            <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Agora:</p>
                <p className="text-4xl mb-2">{routine?.task_icon || '📌'}</p>
                <h2 className="text-xl font-bold">{nextTask.task_name}</h2>

                {routine?.estimated_duration && (
                    <p className="text-sm text-muted-foreground mt-1">
                        ⏱️ ~{routine.estimated_duration} minutos
                    </p>
                )}

                <div className="flex gap-2 mt-6 justify-center">
                    <Button onClick={onComplete}>
                        Concluir ✓
                    </Button>
                    <Button onClick={toggleFocusMode} variant="outline">
                        <List className="h-4 w-4 mr-2" />
                        Ver tudo
                    </Button>
                </div>
            </div>
        </Card>
    );
}
