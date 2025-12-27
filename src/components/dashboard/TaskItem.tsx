'use client';

import { useState } from 'react';
import { Check, Clock, ChevronDown, ChevronUp, SkipForward, RotateCcw, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn, formatTime } from '@/lib/utils';
import type { TaskLog, Routine, Subtask } from '@/types';
import { TaskEditDialog } from './TaskEditDialog';

interface TaskItemProps {
    task: TaskLog;
    routine?: Routine;
    onStatusChange: (status: TaskLog['status']) => void;
    onSubtaskToggle?: (subtaskId: string) => void;
}

export function TaskItem({ task, routine, onStatusChange, onSubtaskToggle }: TaskItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const hasSubtasks = routine?.subtasks && routine.subtasks.length > 0;
    const hasNote = routine?.note;
    const isExpandable = hasSubtasks || hasNote;

    const completedSubtasks = task.subtasks_completed || [];

    return (
        <Card
            className={cn(
                'p-4 transition-all border-[0.5px] shadow-none bg-card/20',
                task.status === 'done' && 'opacity-60 bg-muted/20',
                task.status === 'skipped' && 'opacity-40'
            )}
        >
            <div className="flex items-start gap-3">
                {/* Checkbox */}
                <Checkbox
                    checked={task.status === 'done'}
                    onCheckedChange={(checked) =>
                        onStatusChange(checked ? 'done' : 'pending')
                    }
                    className="mt-1"
                />

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{routine?.task_icon || '📌'}</span>
                        <span
                            className={cn(
                                'font-medium',
                                task.status === 'done' && 'line-through'
                            )}
                        >
                            {task.task_name}
                        </span>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        {routine?.is_fixed && routine.scheduled_time && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(routine.scheduled_time)}
                            </span>
                        )}
                        {!routine?.is_fixed && (
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                                Flexível
                            </span>
                        )}
                        {routine?.estimated_duration && (
                            <span>⏱️ ~{routine.estimated_duration}min</span>
                        )}
                    </div>

                    {/* Expandido */}
                    {isExpanded && (
                        <div className="mt-3 space-y-3">
                            {/* Subtarefas */}
                            {hasSubtasks && (
                                <div className="space-y-2">
                                    {routine.subtasks!.map((subtask: Subtask) => (
                                        <label
                                            key={subtask.id}
                                            className="flex items-center gap-2 text-sm cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={completedSubtasks.includes(subtask.id)}
                                                onCheckedChange={() => onSubtaskToggle?.(subtask.id)}
                                                className="h-4 w-4"
                                            />
                                            <span
                                                className={cn(
                                                    completedSubtasks.includes(subtask.id) &&
                                                    'line-through text-muted-foreground'
                                                )}
                                            >
                                                {subtask.text}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* Nota */}
                            {hasNote && (
                                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                                    📝 {routine.note}
                                </p>
                            )}

                            {/* Ações */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onStatusChange('skipped')}
                                    disabled={task.status !== 'pending'}
                                >
                                    <SkipForward className="h-4 w-4 mr-1" />
                                    Pular
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onStatusChange('postponed')}
                                    disabled={task.status !== 'pending'}
                                >
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Adiar
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Botão editar */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground/50 hover:text-foreground"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                >
                    <Pencil className="h-3 w-3" />
                </Button>

                {/* Botão expandir */}
                {isExpandable && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                )}

                {/* Indicador de status */}
                {task.status === 'done' && (
                    <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-success" />
                    </div>
                )}
            </div>

            <TaskEditDialog
                open={isEditing}
                onOpenChange={setIsEditing}
                task={task}
                routine={routine}
            />
        </Card>
    );
}
