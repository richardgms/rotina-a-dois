import React, { useState } from 'react';
import { Notification } from '@/types';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bell, Heart, X, Check, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createClient } from '@/lib/supabase/client';

interface NotificationItemProps {
    notification: Notification;
    onClose?: () => void;
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
    const { markAsRead, deleteNotification, respondToRequest, fetchNotifications } = useNotifications();
    const [loading, setLoading] = useState(false);

    const handleAction = async (accept: boolean) => {
        if (loading) return;
        setLoading(true);

        try {
            // Precisamos encontrar o ID da solicitação pendente
            // Como a notificação não tem o ID da request, buscamos no banco
            // IMPORTANTE: Isso assume que data.from_user_id existe na notificação
            if (notification.type === 'pairing_request' && notification.data.from_user_id) {
                const supabase = createClient();
                const { data: request } = await supabase
                    .from('pairing_requests')
                    .select('id')
                    .eq('from_user_id', notification.data.from_user_id)
                    .eq('to_user_id', notification.user_id)
                    .eq('status', 'pending')
                    .single();

                if (request) {
                    await respondToRequest(request.id, accept);
                    // Deletar a notificação após responder pois ela não é mais necessária
                    await deleteNotification(notification.id);
                    if (onClose) onClose();
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteNotification(notification.id);
    };

    const handleClick = () => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'pairing_request':
                return <Heart className="h-5 w-5 text-custom-pink" />;
            case 'pairing_accepted':
                return <Heart className="h-5 w-5 text-green-500 fill-green-500" />;
            case 'pairing_rejected':
                return <X className="h-5 w-5 text-red-500" />;
            default:
                return <Bell className="h-5 w-5 text-custom-blue" />;
        }
    };

    return (
        <div
            className={cn(
                "p-4 border-b border-border hover:bg-accent/50 transition-colors relative group",
                !notification.read && "bg-accent/20"
            )}
            onClick={handleClick}
        >
            <div className="flex gap-3">
                <div className="mt-1 flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground pt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ptBR })}
                    </p>

                    {notification.type === 'pairing_request' && (
                        <div className="flex gap-2 pt-2">
                            <Button
                                size="sm"
                                className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(true);
                                }}
                                disabled={loading}
                            >
                                <Check className="h-3 w-3 mr-1" />
                                Aceitar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(false);
                                }}
                                disabled={loading}
                            >
                                <X className="h-3 w-3 mr-1" />
                                Recusar
                            </Button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-red-500 rounded-full hover:bg-red-50 absolute top-2 right-2"
                    title="Excluir notificação"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
