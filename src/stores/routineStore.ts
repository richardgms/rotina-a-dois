import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Routine, TaskLog, DailyStatus } from '@/types';

interface RoutineState {
    routines: Routine[];
    todayTasks: TaskLog[];
    dailyStatus: DailyStatus | null;
    selectedDay: number; // 0-6
    selectedDate: string; // Always ISO string for consistency
    isLoading: boolean;
    isFocusMode: boolean;
}

interface RoutineActions {
    setRoutines: (routines: Routine[]) => void;
    setTodayTasks: (tasks: TaskLog[]) => void;
    setDailyStatus: (status: DailyStatus | null) => void;
    setSelectedDay: (day: number) => void;
    setSelectedDate: (date: Date) => void;
    setLoading: (loading: boolean) => void;
    toggleFocusMode: () => void;
    updateTaskStatus: (taskId: string, status: TaskLog['status']) => void;
    addRoutine: (routine: Routine) => void;
    updateRoutine: (id: string, updates: Partial<Routine>) => void;
    deleteRoutine: (id: string) => void;
}

export const useRoutineStore = create<RoutineState & RoutineActions>()(
    persist(
        immer((set) => ({
            routines: [],
            todayTasks: [],
            dailyStatus: null,
            selectedDay: new Date().getDay(),
            selectedDate: new Date().toISOString(),
            isLoading: true, // Initial load is true, but persisted state might override or we handle hydration
            isFocusMode: false,

            setRoutines: (routines) => set({ routines }),

            setTodayTasks: (todayTasks) => set({ todayTasks }),

            setDailyStatus: (dailyStatus) => set({ dailyStatus }),

            setSelectedDay: (selectedDay) => set({ selectedDay }),

            setSelectedDate: (date) =>
                set({
                    selectedDate: date.toISOString(),
                    selectedDay: date.getDay()
                }),

            setLoading: (isLoading) => set({ isLoading }),

            toggleFocusMode: () =>
                set((state) => {
                    state.isFocusMode = !state.isFocusMode;
                }),

            updateTaskStatus: (taskId, status) =>
                set((state) => {
                    const task = state.todayTasks.find((t) => t.id === taskId);
                    if (task) {
                        task.status = status;
                        if (status === 'done') {
                            task.completed_at = new Date().toISOString();
                        }
                    }
                }),

            addRoutine: (routine) =>
                set((state) => {
                    state.routines.push(routine);
                }),

            updateRoutine: (id, updates) =>
                set((state) => {
                    const index = state.routines.findIndex((r) => r.id === id);
                    if (index !== -1) {
                        state.routines[index] = { ...state.routines[index], ...updates };
                    }
                }),

            deleteRoutine: (id) =>
                set((state) => {
                    state.routines = state.routines.filter((r) => r.id !== id);
                }),
        })),
        {
            name: 'routine-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                routines: state.routines,
                // Don't persist todayTasks to avoid stale data after midnight
                // Don't persist selectedDate to avoid opening on wrong day
            }),
        }
    )
);
