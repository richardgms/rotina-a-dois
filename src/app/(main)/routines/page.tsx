'use client';

import { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useRoutines } from '@/hooks/useRoutines';
import { useRoutineStore } from '@/stores/routineStore';
import { useUIStore } from '@/stores/uiStore';
import { DAYS_OF_WEEK_SHORT, Routine } from '@/types';
import { cn, formatTime } from '@/lib/utils';
import { TaskForm } from '@/components/routines/TaskForm';

export default function RoutinesPage() {
    const { routines, routinesForDay, isLoading, fetchRoutines, removeRoutine, createRoutine, editRoutine } = useRoutines();
    const { selectedDay, setSelectedDay } = useRoutineStore();
    const { isTaskFormOpen, openTaskForm, closeTaskForm, editingRoutineId, openConfirmDialog } = useUIStore();

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    const handleDelete = (id: string, name: string) => {
        openConfirmDialog({
            title: 'Remover tarefa?',
            description: `"${name}" será removida da sua rotina.`,
            onConfirm: () => removeRoutine(id),
        });
    };

    const handleSaveRoutine = async (data: Partial<Routine>) => {
        try {
            if (editingRoutineId) {
                await editRoutine(editingRoutineId, data);
            } else {
                await createRoutine({
                    ...data,
                    day_of_week: selectedDay
                } as Omit<Routine, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
            }
        } catch (error) {
            console.error('Failed to save routine', error);
            throw error; // Re-throw to be caught by form
        }
    };

    // Find routine being edited
    const editingRoutine = editingRoutineId
        ? routines.find(r => r.id === editingRoutineId)
        : undefined;

    if (isLoading) return <LoadingPage />;

    return (
        <PageContainer>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Editar Rotinas</h1>
            </div>

            {/* Seletor de dia */}
            <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
                {DAYS_OF_WEEK_SHORT.map((day, index) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(index)}
                        className={cn(
                            'flex-1 min-w-[44px] py-2 rounded-lg text-sm font-medium transition-colors',
                            selectedDay === index
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                        )}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Lista de tarefas do dia */}
            {routinesForDay.length === 0 ? (
                <EmptyState
                    icon="📝"
                    title="Nenhuma tarefa neste dia"
                    description="Adicione tarefas para criar sua rotina"
                    action={{
                        label: 'Adicionar tarefa',
                        onClick: () => openTaskForm(),
                    }}
                />
            ) : (
                <div className="space-y-2 mb-4">
                    {routinesForDay
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((routine) => (
                            <Card key={routine.id} className="p-3">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />

                                    <span className="text-xl">{routine.task_icon}</span>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{routine.task_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {routine.is_fixed && routine.scheduled_time
                                                ? formatTime(routine.scheduled_time)
                                                : 'Flexível'}
                                            {' • '}
                                            {routine.estimated_duration}min
                                        </p>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openTaskForm(routine.id)}
                                    >
                                        ✏️
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(routine.id, routine.task_name)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                </div>
            )}

            {/* Botão adicionar */}
            {routinesForDay.length > 0 && (
                <Button onClick={() => openTaskForm()} className="w-full mb-8">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar tarefa
                </Button>
            )}

            {/* Modal Form */}
            {isTaskFormOpen && (
                <TaskForm
                    open={isTaskFormOpen}
                    onClose={closeTaskForm}
                    onSave={handleSaveRoutine}
                    initialData={editingRoutine}
                />
            )}
        </PageContainer>
    );
}
