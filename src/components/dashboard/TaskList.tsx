import { useRouter } from 'next/navigation';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { FocusMode } from '@/components/dashboard/FocusMode';
import { EmptyState } from '@/components/common/EmptyState';
import type { TaskLog, Routine } from '@/types';

interface TaskListProps {
    tasks: TaskLog[];
    routines: Routine[];
    isFocusMode: boolean;
    onTaskStatusChange: (taskId: string, status: TaskLog['status']) => void;
    nextTask?: TaskLog;
}

export function TaskList({
    tasks,
    routines,
    isFocusMode,
    onTaskStatusChange,
    nextTask
}: TaskListProps) {
    const router = useRouter();

    // Se estiver em modo foco
    if (isFocusMode) {
        return (
            <FocusMode
                nextTask={nextTask}
                routine={routines.find((r) => r.id === nextTask?.routine_id)}
                onComplete={() => nextTask && onTaskStatusChange(nextTask.id, 'done')}
            />
        );
    }

    // Modo lista normal
    return (
        <>
            {/* Botão modo foco (mini) se tiver tarefas */}
            {tasks.length > 0 && (
                <div className="mb-4">
                    <FocusMode
                        nextTask={nextTask}
                        routine={routines.find((r) => r.id === nextTask?.routine_id)}
                        onComplete={() => nextTask && onTaskStatusChange(nextTask.id, 'done')}
                    />
                </div>
            )}

            {/* Lista ou Empty State */}
            {tasks.length === 0 ? (
                <EmptyState
                    icon="📝"
                    title="Nenhuma tarefa para hoje"
                    description="Configure sua rotina para começar"
                    action={{
                        label: 'Criar rotina',
                        onClick: () => router.push('/routines'),
                    }}
                />
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            routine={routines.find((r) => r.id === task.routine_id)}
                            onStatusChange={(status) => onTaskStatusChange(task.id, status)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
