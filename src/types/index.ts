// ============================================
// TIPOS PRINCIPAIS - ROTINA A DOIS
// ============================================

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url: string | null;
    partner_id: string | null;
    pairing_code: string | null;
    theme: 'ocean' | 'midnight';
    font_size: 'normal' | 'large';
    first_day_of_week: number;
    notifications_enabled: boolean;
    quiet_hours_start: string | null;
    quiet_hours_end: string | null;
    created_at: string;
    updated_at: string;
}

export interface TaskTemplate {
    id: string;
    name: string;
    icon: string;
    category: TaskCategory;
    default_duration: number;
    suggested_subtasks: string[] | null;
    is_system: boolean;
    created_by: string | null;
    created_at: string;
}

export interface Routine {
    id: string;
    user_id: string;
    day_of_week: number; // 0-6 (dom-sab) ou 7 (dia difícil)
    task_name: string;
    task_icon: string;
    category: TaskCategory | null;
    is_fixed: boolean;
    scheduled_time: string | null; // HH:MM
    flexible_period: FlexiblePeriod | null;
    estimated_duration: number; // minutos
    reminder_minutes: number;
    transition_warning: boolean;
    subtasks: Subtask[] | null;
    note: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Subtask {
    id: string;
    text: string;
    order: number;
}

export interface TaskLog {
    id: string;
    user_id: string;
    routine_id: string | null;
    date: string; // YYYY-MM-DD
    task_name: string;
    status: TaskStatus;
    completed_at: string | null;
    completed_by: string | null;
    assumed_by: string | null;
    subtasks_completed: string[] | null; // IDs das subtarefas
    is_difficult_day: boolean;
    created_at: string;
}

export interface DailyStatus {
    id: string;
    user_id: string;
    date: string;
    energy_level: EnergyLevel | null;
    mood: Mood | null;
    is_paused: boolean;
    pause_reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface Suggestion {
    id: string;
    from_user_id: string;
    to_user_id: string;
    content: string;
    status: SuggestionStatus;
    rejection_reason: string | null;
    created_at: string;
    responded_at: string | null;
}

export interface Feedback {
    id: string;
    from_user_id: string;
    to_user_id: string;
    feedback_type: FeedbackType;
    created_at: string;
}

export interface PausePeriod {
    id: string;
    user_id: string;
    start_date: string;
    end_date: string;
    reason: string | null;
    is_active: boolean;
    created_at: string;
}

export interface Streak {
    id: string;
    user_id: string;
    current_streak: number;
    longest_streak: number;
    last_completed_date: string | null;
    updated_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    type: 'pairing_request' | 'pairing_accepted' | 'pairing_rejected';
    title: string;
    message: string | null;
    data: {
        from_user_id?: string;
        from_user_name?: string;
        partner_id?: string;
    };
    read: boolean;
    created_at: string;
    updated_at: string;
}

export interface PairingRequest {
    id: string;
    from_user_id: string;
    to_user_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    updated_at: string;
}

// ============================================
// ENUMS E TIPOS AUXILIARES
// ============================================

export type TaskCategory =
    | 'morning'
    | 'cleaning'
    | 'kitchen'
    | 'evening'
    | 'selfcare'
    | 'work';

export type FlexiblePeriod =
    | 'morning'
    | 'afternoon'
    | 'evening'
    | 'anytime';

export type TaskStatus =
    | 'pending'
    | 'done'
    | 'skipped'
    | 'postponed';

export type EnergyLevel =
    | 'high'
    | 'medium'
    | 'low';

export type Mood =
    | 'good'
    | 'meh'
    | 'difficult';

export type SuggestionStatus =
    | 'pending'
    | 'accepted'
    | 'rejected';

export type FeedbackType =
    | 'great_job'
    | 'you_can_do_it'
    | 'need_help'
    | 'making_coffee'
    | 'im_here';

// ============================================
// TIPOS DE UI
// ============================================

export interface DayInfo {
    date: Date;
    dayOfWeek: number;
    isToday: boolean;
    isPast: boolean;
    isFuture: boolean;
    tasks: TaskLog[];
    completionPercentage: number;
    status: DailyStatus | null;
}

export interface WeekInfo {
    startDate: Date;
    endDate: Date;
    days: DayInfo[];
}

// ============================================
// CONSTANTES
// ============================================

export const DAYS_OF_WEEK = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
] as const;

export const DAYS_OF_WEEK_SHORT = [
    'Dom',
    'Seg',
    'Ter',
    'Qua',
    'Qui',
    'Sex',
    'Sáb',
] as const;

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
    morning: 'Manhã',
    cleaning: 'Limpeza',
    kitchen: 'Cozinha',
    evening: 'Noite',
    selfcare: 'Autocuidado',
    work: 'Trabalho',
};

export const PERIOD_LABELS: Record<FlexiblePeriod, string> = {
    morning: 'Manhã',
    afternoon: 'Tarde',
    evening: 'Noite',
    anytime: 'Qualquer hora',
};

export const ENERGY_LABELS: Record<EnergyLevel, { label: string; icon: string }> = {
    high: { label: 'Alta', icon: '🔋' },
    medium: { label: 'Média', icon: '🔋' },
    low: { label: 'Baixa', icon: '🪫' },
};

export const MOOD_LABELS: Record<Mood, { label: string; icon: string }> = {
    good: { label: 'Bem', icon: '😊' },
    meh: { label: 'Meh', icon: '😐' },
    difficult: { label: 'Difícil', icon: '😔' },
};

export const FEEDBACK_MESSAGES: Record<FeedbackType, { label: string; icon: string }> = {
    great_job: { label: 'Mandou bem hoje!', icon: '👍' },
    you_can_do_it: { label: 'Você consegue!', icon: '💪' },
    need_help: { label: 'Precisa de ajuda?', icon: '🤝' },
    making_coffee: { label: 'Vou fazer um café/chá', icon: '☕' },
    im_here: { label: 'Tô aqui com você', icon: '🫂' },
};

export const DURATION_OPTIONS = [
    { value: 5, label: '5 min' },
    { value: 10, label: '10 min' },
    { value: 15, label: '15 min' },
    { value: 20, label: '20 min' },
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1h30' },
    { value: 120, label: '2 horas' },
];

export const REMINDER_OPTIONS = [
    { value: 0, label: 'Na hora' },
    { value: 5, label: '5 min antes' },
    { value: 10, label: '10 min antes' },
    { value: 15, label: '15 min antes' },
    { value: 30, label: '30 min antes' },
    { value: 60, label: '1 hora antes' },
];
