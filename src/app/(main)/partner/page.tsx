'use client';

import { useEffect, useState } from 'react';
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

            setPartnerStatus(status as DailyStatus | null);
            setPartnerTasks((tasks as TaskLog[]) || []);
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
                                    <span className={task.status === 'done' ? 'line-through text-muted-foreground' : ''}>
                                        {task.task_name}
                                    </span>
                                    <span>
                                        {task.status === 'done' ? '✅' : task.status === 'skipped' ? '⏭️' : '⬜'}
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
