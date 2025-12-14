import { create } from 'zustand';

interface UIState {
    isEnergyMoodOpen: boolean;
    isTaskFormOpen: boolean;
    isSuggestionFormOpen: boolean;
    isConfirmDialogOpen: boolean;
    confirmDialogData: {
        title: string;
        description: string;
        onConfirm: () => void;
    } | null;
    editingRoutineId: string | null;
}

interface UIActions {
    openEnergyMood: () => void;
    closeEnergyMood: () => void;
    openTaskForm: (routineId?: string) => void;
    closeTaskForm: () => void;
    openSuggestionForm: () => void;
    closeSuggestionForm: () => void;
    openConfirmDialog: (data: UIState['confirmDialogData']) => void;
    closeConfirmDialog: () => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
    isEnergyMoodOpen: false,
    isTaskFormOpen: false,
    isSuggestionFormOpen: false,
    isConfirmDialogOpen: false,
    confirmDialogData: null,
    editingRoutineId: null,

    openEnergyMood: () => set({ isEnergyMoodOpen: true }),
    closeEnergyMood: () => set({ isEnergyMoodOpen: false }),

    openTaskForm: (routineId) =>
        set({ isTaskFormOpen: true, editingRoutineId: routineId ?? null }),
    closeTaskForm: () =>
        set({ isTaskFormOpen: false, editingRoutineId: null }),

    openSuggestionForm: () => set({ isSuggestionFormOpen: true }),
    closeSuggestionForm: () => set({ isSuggestionFormOpen: false }),

    openConfirmDialog: (data) =>
        set({ isConfirmDialogOpen: true, confirmDialogData: data }),
    closeConfirmDialog: () =>
        set({ isConfirmDialogOpen: false, confirmDialogData: null }),
}));
