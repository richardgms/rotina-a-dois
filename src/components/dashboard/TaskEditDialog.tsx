'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import type { TaskLog, Routine } from '@/types';
import { useTaskLogs } from '@/hooks/useTaskLogs';
import { useRoutines } from '@/hooks/useRoutines';
import { toast } from 'sonner';

interface TaskEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: TaskLog;
    routine?: Routine;
}

export function TaskEditDialog({ open, onOpenChange, task, routine }: TaskEditDialogProps) {
    const { updateTaskLog, deleteTaskLog } = useTaskLogs();
    const { editRoutine, removeRoutine } = useRoutines();

    const [name, setName] = useState(task.task_name);
    const [scheduledTime, setScheduledTime] = useState(routine?.scheduled_time || '');
    const [note, setNote] = useState(routine?.note || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (routine) {
                // Se tem rotina, atualiza a rotina (impacta futuro)
                await editRoutine(routine.id, {
                    task_name: name,
                    scheduled_time: scheduledTime || null,
                    note: note || null,
                });

                // E atualiza o log de hoje para refletir o nome
                await updateTaskLog(task.id, { task_name: name });
            } else {
                // Se é tarefa avulsa, só atualiza o log
                await updateTaskLog(task.id, { task_name: name });
            }

            toast.success('Tarefa atualizada');
            onOpenChange(false);
        } catch (error) {
            toast.error('Erro ao atualizar tarefa');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

        setIsLoading(true);
        try {
            if (routine) {
                if (confirm('Deseja excluir permanentemente esta rotina para todos os dias? (Cancelar exclui apenas hoje)')) {
                    await removeRoutine(routine.id);
                    await deleteTaskLog(task.id);
                    toast.success('Rotina excluída');
                } else {
                    await deleteTaskLog(task.id);
                    toast.success('Tarefa removida de hoje');
                }
            } else {
                await deleteTaskLog(task.id);
                toast.success('Tarefa excluída');
            }
            onOpenChange(false);
        } catch (error) {
            toast.error('Erro ao excluir tarefa');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Tarefa</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome da Tarefa</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {routine && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="time">Horário (Opcional)</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="note">Nota</Label>
                                <Textarea
                                    id="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Adicione uma observação..."
                                />
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter className="flex justify-between sm:justify-between items-center w-full gap-2">
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 border shadow-none"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                            Salvar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
