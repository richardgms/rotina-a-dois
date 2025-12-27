import { useRouter } from 'next/navigation';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { FocusMode } from '@/components/dashboard/FocusMode';
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
                <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <FocusMode
                        nextTask={nextTask}
                        routine={routines.find((r) => r.id === nextTask?.routine_id)}
                        onComplete={() => nextTask && onTaskStatusChange(nextTask.id, 'done')}
                    />
                </div>
            )}

            {/* Lista ou Empty State */}
            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">📝</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa para hoje</h3>
                    <p className="text-muted-foreground mb-6 max-w-[250px]">
                        Que tal planejar sua rotina e começar o dia com o pé direito?
                    </p>
                    <button
                        onClick={() => router.push('/routines')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full font-medium transition-colors shadow-sm"
                    >
                        Criar rotina
                    </button>
                </div>
            ) : (
                <div className="space-y-3 pb-8">
                    {tasks.map((task, index) => (
                        <div
                            key={task.id}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <TaskItem
                                task={task}
                                routine={routines.find((r) => r.id === task.routine_id)}
                                onStatusChange={(status) => onTaskStatusChange(task.id, status)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
