import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useNotifications = () => {
    const supabase = createClient();
    const { user } = useAuth();
    const {
        notifications,
        unreadCount,
        setNotifications,
        markAsRead: markAsReadInStore,
        removeNotification
    } = useNotificationStore();

    const fetchNotifications = useCallback(async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
        }
    }, [user, supabase, setNotifications]);

    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id);

            if (error) throw error;
            markAsReadInStore(id);
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
            toast.error('Erro ao atualizar notificação');
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id);

            if (error) throw error;
            removeNotification(id);
        } catch (error) {
            console.error('Erro ao excluir notificação:', error);
            toast.error('Erro ao excluir notificação');
        }
    };

    const respondToRequest = async (requestId: string, accept: boolean) => {
        try {
            const { data, error } = await supabase.rpc('respond_pairing_request', {
                request_id: requestId, // Alterado para corresponder ao nome do parâmetro na função RPC
                accept
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error);

            toast.success(data.message);

            // Recarregar notificações para atualizar estado
            fetchNotifications();

            return { success: true };
        } catch (error: any) {
            console.error('Erro ao responder solicitação:', error);
            toast.error(error.message || 'Erro ao processar resposta');
            return { success: false, error: error.message };
        }
    };

    // Polling inicial e periódico
    useEffect(() => {
        if (user) {
            fetchNotifications();

            // Atualizar a cada 30 segundos
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user, fetchNotifications]);

    // Opcional: Realtime subscription pode ser adicionado aqui depois

    return {
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        deleteNotification,
        respondToRequest
    };
};
