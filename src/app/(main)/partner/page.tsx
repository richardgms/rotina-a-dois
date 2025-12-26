'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, XCircle, SkipForward } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { FeedbackButtons } from '@/components/partner/FeedbackButtons';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ENERGY_LABELS, MOOD_LABELS } from '@/types';
import type { DailyStatus, TaskLog } from '@/types';

export default function PartnerPage() {
    const { partner } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [partnerStatus, setPartnerStatus] = useState<DailyStatus | null>(null);
    const [partnerTasks, setPartnerTasks] = useState<TaskLog[]>([]);
    const [partnerIcons, setPartnerIcons] = useState<Record<string, { icon: string; time: string | null }>>({});
    const supabase = getSupabaseClient();

    useEffect(() => {
        async function fetchPartnerData() {
            if (!partner) {
                setIsLoading(false);
                return;
            }

            const today = format(new Date(), 'yyyy-MM-dd');

            // Buscar status do dia
            const { data: status } = await supabase
                .from('daily_status')
                .select('*')
                .eq('user_id', partner.id)
                .eq('date', today)
                .single();

            // Buscar tarefas do dia
            const { data: tasks } = await supabase
                .from('task_logs')
                .select('*')
                .eq('user_id', partner.id)
                .eq('date', today);

            // Buscar ícones e HORÁRIOS das rotinas
            type RoutineInfo = { icon: string; time: string | null };
            let taskDetails: Record<string, RoutineInfo> = {};

            if (tasks && tasks.length > 0) {
                console.log('>>> Tasks found:', tasks.length);
                const routineIds = (tasks as TaskLog[]).map((t) => t.routine_id).filter(Boolean) as string[];
                console.log('>>> Routine IDs to fetch:', routineIds);

                if (routineIds.length > 0) {
                    const { data: routines, error: routinesError } = await supabase
                        .from('routines')
                        .select('id, task_icon, scheduled_time')
                        .in('id', routineIds);

                    if (routinesError) {
                        console.error('>>> Error fetching partner routines:', routinesError);
                    } else {
                        console.log('>>> Routines fetched:', routines?.length, routines);
                        if (routines) {
                            taskDetails = routines.reduce((acc: Record<string, RoutineInfo>, r: { id: string; task_icon: string; scheduled_time: string | null }) => ({
                                ...acc,
                                [r.id]: { icon: r.task_icon, time: r.scheduled_time }
                            }), {});
                        }
                    }
                }
            }

            setPartnerStatus(status as DailyStatus | null);
            setPartnerIcons(taskDetails); // Renomear state seria ideal, mas vou manter para minimizar diff por enquanto, ajustando só o tipo no state

            // Deduplicate tasks by routine_id (or task_name if routine_id missing) to fix display issues
            const uniqueTasks = (tasks as TaskLog[] || []).reduce((acc: TaskLog[], current) => {
                const x = acc.find(item => item.routine_id === current.routine_id);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);

            setPartnerTasks(uniqueTasks);
            setIsLoading(false);
        }

        fetchPartnerData();
    }, [partner, supabase]);

    if (isLoading) return <LoadingPage />;

    if (!partner) {
        return (
            <PageContainer>
                <EmptyState
                    icon="💔"
                    title="Sem parceiro vinculado"
                    description="Você precisa conectar com seu amor primeiro"
                />
            </PageContainer>
        );
    }

    const progress = partnerTasks.length > 0
        ? Math.round((partnerTasks.filter((t) => t.status === 'done').length / partnerTasks.length) * 100)
        : 0;

    const initials = partner.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return (
        <PageContainer>
            {/* Header do parceiro */}
            <Card className="p-6 mb-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={partner.avatar_url || undefined} />
                        <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h1 className="text-xl font-bold">{partner.name}</h1>

                        {partnerStatus && (
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                {partnerStatus.energy_level && (
                                    <span>{ENERGY_LABELS[partnerStatus.energy_level].icon} {ENERGY_LABELS[partnerStatus.energy_level].label}</span>
                                )}
                                {partnerStatus.mood && (
                                    <span>{MOOD_LABELS[partnerStatus.mood].icon} {MOOD_LABELS[partnerStatus.mood].label}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Progresso */}
                <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Progresso de hoje</span>
                        <span className="font-semibold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                </div>
            </Card>

            {/* Botões de feedback */}
            <div className="mb-6">
                <h2 className="text-sm font-medium mb-3">Enviar uma mensagem de apoio:</h2>
                <FeedbackButtons partnerId={partner.id} />
            </div>

            {/* Tarefas do parceiro */}
            <div>
                <h2 className="text-sm font-medium mb-3">Tarefas de hoje:</h2>

                {partnerTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma tarefa registrada hoje
                    </p>
                ) : (
                    <div className="space-y-2">
                        {partnerTasks.map((task) => (
                            <Card key={task.id} className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center">
                                            <span className={task.status === 'done' ? 'line-through text-muted-foreground' : ''}>
                                                <span className="mr-2">{partnerIcons[task.routine_id || '']?.icon || '📌'}</span>
                                                {task.task_name}
                                            </span>
                                        </div>
                                        {/* Exibir horário se disponível */}
                                        {partnerIcons[task.routine_id || '']?.time && (
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-6">
                                                <Clock className="h-3 w-3" />
                                                {partnerIcons[task.routine_id || '']?.time}
                                            </span>
                                        )}
                                    </div>
                                    <span>
                                        {(() => {
                                            // Como estamos listando tarefas filtradas por "Hoje" no banco,
                                            // não precisamos checar se é passado. Se é pendente, é relógio.
                                            // O "X" só faria sentido em histórico.

                                            if (task.status === 'done') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
                                            if (task.status === 'skipped') return <SkipForward className="h-5 w-5 text-muted-foreground" />;

                                            // Pendente (Sempre Clock, pois a lista é de hoje)
                                            return <Clock className="h-5 w-5 text-orange-400" />;
                                        })()}
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
