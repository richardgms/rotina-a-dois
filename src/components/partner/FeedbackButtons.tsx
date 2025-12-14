'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { FEEDBACK_MESSAGES } from '@/types';
import type { FeedbackType } from '@/types';
import { toast } from 'sonner';

interface FeedbackButtonsProps {
    partnerId: string;
}

export function FeedbackButtons({ partnerId }: FeedbackButtonsProps) {
    const [sending, setSending] = useState<FeedbackType | null>(null);
    const { user } = useAuthStore();
    const supabase = getSupabaseClient();

    const sendFeedback = async (type: FeedbackType) => {
        if (!user) return;

        setSending(type);
        try {
            const { error } = await supabase.from('feedbacks').insert({
                from_user_id: user.id,
                to_user_id: partnerId,
                feedback_type: type,
            });

            if (error) throw error;
            toast.success('Enviado! 💕');
        } catch (error) {
            toast.error('Erro ao enviar');
        } finally {
            setSending(null);
        }
    };

    const feedbackTypes: FeedbackType[] = ['great_job', 'you_can_do_it', 'need_help', 'making_coffee', 'im_here'];

    return (
        <div className="grid grid-cols-2 gap-2">
            {feedbackTypes.map((type) => (
                <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => sendFeedback(type)}
                    disabled={sending === type}
                    className="h-auto py-2"
                >
                    <span className="mr-1">{FEEDBACK_MESSAGES[type].icon}</span>
                    <span className="text-xs">{FEEDBACK_MESSAGES[type].label}</span>
                </Button>
            ))}
        </div>
    );
}
