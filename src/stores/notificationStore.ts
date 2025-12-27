import { create } from 'zustand';
import { Notification } from '@/types';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    removeNotification: (id: string) => void;
    updateUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,

    setNotifications: (notifications) => {
        set({
            notifications,
            unreadCount: notifications.filter(n => !n.read).length
        });
    },

    addNotification: (notification) => {
        const current = get().notifications;
        const updated = [notification, ...current];
        set({
            notifications: updated,
            unreadCount: updated.filter(n => !n.read).length
        });
    },

    markAsRead: (id) => {
        const current = get().notifications;
        const updated = current.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        set({
            notifications: updated,
            unreadCount: updated.filter(n => !n.read).length
        });
    },

    removeNotification: (id) => {
        const current = get().notifications;
        const updated = current.filter(n => n.id !== id);
        set({
            notifications: updated,
            unreadCount: updated.filter(n => !n.read).length
        });
    },

    updateUnreadCount: () => {
        const current = get().notifications;
        set({ unreadCount: current.filter(n => !n.read).length });
    }
}));
