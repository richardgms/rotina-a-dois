'use client';

import { useState, useCallback } from 'react';
import { format, eachDayOfInterval } from 'date-fns';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

interface DayStats {
    date: Date;
    taskCount: number;
    completedCount: number;
    percentage: number;
    energy?: string;
    mood?: string;
}

export function useCalendarData() {
    const supabase = getSupabaseClient();
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [daysData, setDaysData] = useState<Map<string, DayStats>>(new Map());

    const fetchRangeData = useCallback(async (startDate: Date, endDate: Date) => {
        if (!user) {
            setIsLoading(false);
            return new Map<string, DayStats>();
        }

        setIsLoading(true);
        const startStr = format(startDate, 'yyyy-MM-dd');
        const endStr = format(endDate, 'yyyy-MM-dd');

        try {
            // Fetch task logs for the range
            const { data: taskLogs, error: logsError } = await supabase
                .from('task_logs')
                .select('date, status')
                .eq('user_id', user.id)
                .gte('date', startStr)
                .lte('date', endStr);

            if (logsError) throw logsError;

            // Fetch daily status for the range
            const { data: dailyStatus, error: statusError } = await supabase
                .from('daily_status')
                .select('date, energy_level, mood')
                .eq('user_id', user.id)
                .gte('date', startStr)
                .lte('date', endStr);

            if (statusError) throw statusError;

            // Build stats map
            const statsMap = new Map<string, DayStats>();
            const days = eachDayOfInterval({ start: startDate, end: endDate });

            days.forEach((date) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                const dayLogs = taskLogs?.filter((log: any) => log.date === dateKey) || [];
                const dayStatus = dailyStatus?.find((s: any) => s.date === dateKey);

                const taskCount = dayLogs.length;
                const completedCount = dayLogs.filter((log: any) => log.status === 'done').length;
                const percentage = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

                statsMap.set(dateKey, {
                    date,
                    taskCount,
                    completedCount,
                    percentage,
                    energy: dayStatus?.energy_level,
                    mood: dayStatus?.mood,
                });
            });

            setDaysData(statsMap);
            return statsMap;
        } catch (error) {
            console.error('Erro ao buscar dados do calendário:', error);
            return new Map<string, DayStats>();
        } finally {
            setIsLoading(false);
        }
    }, [user, supabase]);

    return {
        daysData,
        isLoading,
        fetchRangeData,
    };
}
