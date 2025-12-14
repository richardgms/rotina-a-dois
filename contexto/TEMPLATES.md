# TEMPLATES - ROTINA A DOIS

## Componentes e Código Prontos para Usar
**Copie, adapte e use. Não reinvente a roda.**

---

## 1. CONFIGURAÇÃO BASE

### 1.1. Tipos (src/types/index.ts)

```typescript
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
```

### 1.2. Cliente Supabase (src/lib/supabase/client.ts)

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton para uso em componentes client
let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
  if (!client) {
    client = createClient();
  }
  return client;
}
```

### 1.3. Servidor Supabase (src/lib/supabase/server.ts)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorar erro em Server Components
          }
        },
      },
    }
  );
}
```

### 1.4. Middleware (src/middleware.ts)

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Rotas públicas
  const publicRoutes = ['/login', '/auth/callback'];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Não autenticado tentando acessar rota protegida
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Autenticado tentando acessar login
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Verificar pareamento (exceto na página de pairing)
  if (user && !request.nextUrl.pathname.startsWith('/pairing')) {
    const { data: userData } = await supabase
      .from('users')
      .select('partner_id')
      .eq('id', user.id)
      .single();

    if (!userData?.partner_id) {
      const url = request.nextUrl.clone();
      url.pathname = '/pairing';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)',
  ],
};
```

### 1.5. Utilitários (src/lib/utils.ts)

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isPast, isFuture, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Merge de classes Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatação de datas
export function formatDate(date: Date | string, pattern: string = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, pattern, { locale: ptBR });
}

export function formatTime(time: string): string {
  // Converte HH:MM:SS para HH:MM
  return time.substring(0, 5);
}

export function formatDateExtended(date: Date): string {
  return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
}

// Checagem de datas
export function checkIsToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return isToday(d);
}

export function checkIsPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return isPast(d) && !isToday(d);
}

export function checkIsFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return isFuture(d);
}

// Semana
export function getWeekDays(date: Date, firstDayOfWeek: 0 | 1 = 0): Date[] {
  const start = startOfWeek(date, { weekStartsOn: firstDayOfWeek });
  const end = endOfWeek(date, { weekStartsOn: firstDayOfWeek });
  return eachDayOfInterval({ start, end });
}

// Gerar código de pareamento
export function generatePairingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sem I, O, 0, 1 para evitar confusão
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Calcular porcentagem de conclusão
export function calculateCompletionPercentage(
  tasks: { status: string }[]
): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === 'done').length;
  return Math.round((completed / tasks.length) * 100);
}

// Saudação baseada no horário
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

// Cor baseada na porcentagem
export function getCompletionColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-500';
  if (percentage >= 50) return 'text-yellow-500';
  return 'text-red-500';
}

export function getCompletionBgColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

// Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

### 1.6. CSS Global (src/app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Tema Oceano (padrão) */
    --background: 183 100% 96%;
    --foreground: 194 69% 24%;
    
    --card: 0 0% 100%;
    --card-foreground: 194 69% 24%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 194 69% 24%;
    
    --primary: 187 85% 53%;
    --primary-foreground: 0 0% 100%;
    
    --secondary: 185 96% 90%;
    --secondary-foreground: 194 69% 24%;
    
    --muted: 185 30% 90%;
    --muted-foreground: 215 16% 47%;
    
    --accent: 185 96% 90%;
    --accent-foreground: 194 69% 24%;
    
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    
    --success: 160 84% 39%;
    --success-foreground: 0 0% 100%;
    
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 0%;
    
    --border: 185 96% 82%;
    --input: 185 96% 82%;
    --ring: 187 85% 53%;
    
    --radius: 0.75rem;
  }

  [data-theme="midnight"] {
    /* Tema Midnight */
    --background: 222 47% 11%;
    --foreground: 214 32% 91%;
    
    --card: 217 33% 17%;
    --card-foreground: 214 32% 91%;
    
    --popover: 217 33% 17%;
    --popover-foreground: 214 32% 91%;
    
    --primary: 217 91% 60%;
    --primary-foreground: 0 0% 100%;
    
    --secondary: 217 33% 25%;
    --secondary-foreground: 214 32% 91%;
    
    --muted: 217 33% 25%;
    --muted-foreground: 215 20% 65%;
    
    --accent: 217 33% 25%;
    --accent-foreground: 214 32% 91%;
    
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    
    --success: 160 84% 39%;
    --success-foreground: 0 0% 100%;
    
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 0%;
    
    --border: 217 33% 27%;
    --input: 217 33% 27%;
    --ring: 217 91% 60%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* Fonte grande para acessibilidade */
  [data-font-size="large"] {
    font-size: 18px;
  }
}

@layer utilities {
  /* Esconde scrollbar mas permite scroll */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Safe area para dispositivos com notch */
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
}
```

---

## 2. STORES (ZUSTAND)

### 2.1. Auth Store (src/stores/authStore.ts)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  partner: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setPartner: (partner: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      partner: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setPartner: (partner) => set({ partner }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          partner: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        partner: state.partner,
      }),
    }
  )
);
```

### 2.2. Routine Store (src/stores/routineStore.ts)

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Routine, TaskLog, DailyStatus } from '@/types';

interface RoutineState {
  routines: Routine[];
  todayTasks: TaskLog[];
  dailyStatus: DailyStatus | null;
  selectedDay: number; // 0-6
  selectedDate: Date;
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
  immer((set) => ({
    routines: [],
    todayTasks: [],
    dailyStatus: null,
    selectedDay: new Date().getDay(),
    selectedDate: new Date(),
    isLoading: true,
    isFocusMode: false,

    setRoutines: (routines) => set({ routines }),
    
    setTodayTasks: (todayTasks) => set({ todayTasks }),
    
    setDailyStatus: (dailyStatus) => set({ dailyStatus }),
    
    setSelectedDay: (selectedDay) => set({ selectedDay }),
    
    setSelectedDate: (selectedDate) => 
      set({ 
        selectedDate, 
        selectedDay: selectedDate.getDay() 
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
  }))
);
```

### 2.3. UI Store (src/stores/uiStore.ts)

```typescript
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
```

---

## 3. HOOKS

### 3.1. useAuth (src/hooks/useAuth.ts)

```typescript
'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';

export function useAuth() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const { user, partner, isLoading, isAuthenticated, setUser, setPartner, setLoading, logout } = useAuthStore();

  // Buscar usuário atual
  const fetchUser = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setUser(null);
        return null;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      setUser(userData as User);

      // Buscar parceiro se existir
      if (userData?.partner_id) {
        const { data: partnerData } = await supabase
          .from('users')
          .select('*')
          .eq('id', userData.partner_id)
          .single();

        if (partnerData) {
          setPartner(partnerData as User);
        }
      }

      return userData;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setUser(null);
      return null;
    }
  }, [supabase, setUser, setPartner]);

  // Login com magic link
  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  // Login com Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  // Logout
  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  // Pareamento
  const pairWithPartner = async (partnerCode: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    // Buscar parceiro pelo código
    const { data: partnerData, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('pairing_code', partnerCode.toUpperCase())
      .single();

    if (findError || !partnerData) {
      throw new Error('Código inválido');
    }

    if (partnerData.partner_id) {
      throw new Error('Esta pessoa já tem um parceiro vinculado');
    }

    // Vincular os dois
    const { error: updateError } = await supabase
      .from('users')
      .update({ partner_id: partnerData.id })
      .eq('id', user.id);

    if (updateError) throw updateError;

    const { error: updatePartnerError } = await supabase
      .from('users')
      .update({ partner_id: user.id })
      .eq('id', partnerData.id);

    if (updatePartnerError) throw updatePartnerError;

    setPartner(partnerData as User);
    router.push('/');
  };

  // Listener de auth
  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN') {
          await fetchUser();
        } else if (event === 'SIGNED_OUT') {
          logout();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUser, logout, supabase.auth]);

  return {
    user,
    partner,
    isLoading,
    isAuthenticated,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    pairWithPartner,
    refetchUser: fetchUser,
  };
}
```

### 3.2. useRoutines (src/hooks/useRoutines.ts)

```typescript
'use client';

import { useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRoutineStore } from '@/stores/routineStore';
import { useAuthStore } from '@/stores/authStore';
import type { Routine } from '@/types';

export function useRoutines() {
  const supabase = getSupabaseClient();
  const { user } = useAuthStore();
  const {
    routines,
    selectedDay,
    isLoading,
    setRoutines,
    setLoading,
    addRoutine,
    updateRoutine,
    deleteRoutine,
  } = useRoutineStore();

  // Buscar rotinas do usuário
  const fetchRoutines = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setRoutines(data as Routine[]);
    } catch (error) {
      console.error('Erro ao buscar rotinas:', error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase, setRoutines, setLoading]);

  // Rotinas do dia selecionado
  const routinesForDay = routines.filter((r) => r.day_of_week === selectedDay);

  // Criar nova rotina
  const createRoutine = async (data: Omit<Routine, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data: newRoutine, error } = await supabase
      .from('routines')
      .insert({
        ...data,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    addRoutine(newRoutine as Routine);
    return newRoutine;
  };

  // Atualizar rotina
  const editRoutine = async (id: string, data: Partial<Routine>) => {
    const { error } = await supabase
      .from('routines')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    updateRoutine(id, data);
  };

  // Deletar rotina
  const removeRoutine = async (id: string) => {
    const { error } = await supabase
      .from('routines')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    deleteRoutine(id);
  };

  // Clonar rotina para outros dias
  const cloneRoutineToDay = async (routineId: string, targetDays: number[]) => {
    const routine = routines.find((r) => r.id === routineId);
    if (!routine || !user) return;

    const clones = targetDays.map((day) => ({
      ...routine,
      id: undefined,
      day_of_week: day,
      user_id: user.id,
      created_at: undefined,
      updated_at: undefined,
    }));

    const { data, error } = await supabase
      .from('routines')
      .insert(clones)
      .select();

    if (error) throw error;
    data?.forEach((r) => addRoutine(r as Routine));
  };

  // Reordenar rotinas
  const reorderRoutines = async (routineIds: string[]) => {
    const updates = routineIds.map((id, index) => ({
      id,
      sort_order: index,
    }));

    for (const update of updates) {
      await supabase
        .from('routines')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id);
    }

    await fetchRoutines();
  };

  return {
    routines,
    routinesForDay,
    isLoading,
    fetchRoutines,
    createRoutine,
    editRoutine,
    removeRoutine,
    cloneRoutineToDay,
    reorderRoutines,
  };
}
```

### 3.3. useTaskLogs (src/hooks/useTaskLogs.ts)

```typescript
'use client';

import { useCallback } from 'react';
import { format } from 'date-fns';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRoutineStore } from '@/stores/routineStore';
import { useAuthStore } from '@/stores/authStore';
import type { TaskLog, TaskStatus } from '@/types';

export function useTaskLogs() {
  const supabase = getSupabaseClient();
  const { user } = useAuthStore();
  const { todayTasks, selectedDate, setTodayTasks, updateTaskStatus } = useRoutineStore();

  // Buscar logs do dia
  const fetchTaskLogs = useCallback(async (date?: Date) => {
    if (!user) return;

    const targetDate = date || selectedDate;
    const dateStr = format(targetDate, 'yyyy-MM-dd');

    try {
      const { data, error } = await supabase
        .from('task_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', dateStr)
        .order('created_at');

      if (error) throw error;
      setTodayTasks(data as TaskLog[]);
    } catch (error) {
      console.error('Erro ao buscar task logs:', error);
    }
  }, [user, selectedDate, supabase, setTodayTasks]);

  // Criar logs do dia baseado nas rotinas
  const initializeDayTasks = async (routines: { id: string; task_name: string }[]) => {
    if (!user) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    // Verificar se já existem logs para hoje
    const { data: existing } = await supabase
      .from('task_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', dateStr)
      .limit(1);

    if (existing && existing.length > 0) return;

    // Criar logs para cada rotina
    const logs = routines.map((r) => ({
      user_id: user.id,
      routine_id: r.id,
      date: dateStr,
      task_name: r.task_name,
      status: 'pending' as TaskStatus,
    }));

    const { data, error } = await supabase
      .from('task_logs')
      .insert(logs)
      .select();

    if (error) throw error;
    setTodayTasks(data as TaskLog[]);
  };

  // Atualizar status de uma tarefa
  const setTaskStatus = async (taskId: string, status: TaskStatus) => {
    const { error } = await supabase
      .from('task_logs')
      .update({
        status,
        completed_at: status === 'done' ? new Date().toISOString() : null,
        completed_by: user?.id,
      })
      .eq('id', taskId);

    if (error) throw error;
    updateTaskStatus(taskId, status);
  };

  // Marcar subtarefa como completa
  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = todayTasks.find((t) => t.id === taskId);
    if (!task) return;

    const completed = task.subtasks_completed || [];
    const isCompleted = completed.includes(subtaskId);
    const newCompleted = isCompleted
      ? completed.filter((id) => id !== subtaskId)
      : [...completed, subtaskId];

    const { error } = await supabase
      .from('task_logs')
      .update({ subtasks_completed: newCompleted })
      .eq('id', taskId);

    if (error) throw error;
    await fetchTaskLogs();
  };

  // Calcular progresso do dia
  const progress = todayTasks.length > 0
    ? Math.round((todayTasks.filter((t) => t.status === 'done').length / todayTasks.length) * 100)
    : 0;

  // Próxima tarefa pendente
  const nextTask = todayTasks.find((t) => t.status === 'pending');

  return {
    todayTasks,
    progress,
    nextTask,
    fetchTaskLogs,
    initializeDayTasks,
    setTaskStatus,
    toggleSubtask,
  };
}
```

### 3.4. useTheme (src/hooks/useTheme.ts)

```typescript
'use client';

import { useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export function useTheme() {
  const supabase = getSupabaseClient();
  const { user, setUser } = useAuthStore();

  const theme = user?.theme || 'ocean';
  const fontSize = user?.font_size || 'normal';

  // Aplicar tema no documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [theme, fontSize]);

  // Trocar tema
  const setTheme = useCallback(async (newTheme: 'ocean' | 'midnight') => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update({ theme: newTheme })
      .eq('id', user.id);

    if (error) {
      console.error('Erro ao atualizar tema:', error);
      return;
    }

    setUser({ ...user, theme: newTheme });
  }, [user, supabase, setUser]);

  // Trocar tamanho da fonte
  const setFontSize = useCallback(async (newSize: 'normal' | 'large') => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update({ font_size: newSize })
      .eq('id', user.id);

    if (error) {
      console.error('Erro ao atualizar fonte:', error);
      return;
    }

    setUser({ ...user, font_size: newSize });
  }, [user, supabase, setUser]);

  return {
    theme,
    fontSize,
    setTheme,
    setFontSize,
    isOcean: theme === 'ocean',
    isMidnight: theme === 'midnight',
  };
}
```

---

## 4. COMPONENTES DE LAYOUT

### 4.1. Header (src/components/layout/Header.tsx)

```typescript
'use client';

import { Flame } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { getGreeting } from '@/lib/utils';

interface HeaderProps {
  streak?: number;
}

export function Header({ streak = 0 }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-14 items-center justify-between px-4">
        <div>
          <h1 className="text-lg font-semibold">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Amor'}!
          </h1>
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="h-5 w-5" />
            <span className="font-bold">{streak}</span>
          </div>
        )}
      </div>
    </header>
  );
}
```

### 4.2. BottomNav (src/components/layout/BottomNav.tsx)

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, CalendarDays, Heart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Hoje' },
  { href: '/week', icon: Calendar, label: 'Semana' },
  { href: '/month', icon: CalendarDays, label: 'Mês' },
  { href: '/partner', icon: Heart, label: 'Parceiro' },
  { href: '/settings', icon: Settings, label: 'Config' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### 4.3. PageContainer (src/components/layout/PageContainer.tsx)

```typescript
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('container px-4 py-4 pb-20', className)}>
      {children}
    </div>
  );
}
```

### 4.4. Layout Principal (src/app/(main)/layout.tsx)

```typescript
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}
```

---

## 5. COMPONENTES DO DASHBOARD

### 5.1. DayProgress (src/components/dashboard/DayProgress.tsx)

```typescript
'use client';

import { Progress } from '@/components/ui/progress';
import { cn, getCompletionColor } from '@/lib/utils';

interface DayProgressProps {
  percentage: number;
  totalTasks: number;
  completedTasks: number;
}

export function DayProgress({ percentage, totalTasks, completedTasks }: DayProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progresso do dia</span>
        <span className={cn('font-semibold', getCompletionColor(percentage))}>
          {completedTasks}/{totalTasks} tarefas ({percentage}%)
        </span>
      </div>
      <Progress value={percentage} className="h-3" />
    </div>
  );
}
```

### 5.2. TaskItem (src/components/dashboard/TaskItem.tsx)

```typescript
'use client';

import { useState } from 'react';
import { Check, Clock, ChevronDown, ChevronUp, SkipForward, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn, formatTime } from '@/lib/utils';
import type { TaskLog, Routine, Subtask } from '@/types';

interface TaskItemProps {
  task: TaskLog;
  routine?: Routine;
  onStatusChange: (status: TaskLog['status']) => void;
  onSubtaskToggle?: (subtaskId: string) => void;
}

export function TaskItem({ task, routine, onStatusChange, onSubtaskToggle }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasSubtasks = routine?.subtasks && routine.subtasks.length > 0;
  const hasNote = routine?.note;
  const isExpandable = hasSubtasks || hasNote;

  const completedSubtasks = task.subtasks_completed || [];

  return (
    <Card
      className={cn(
        'p-4 transition-all',
        task.status === 'done' && 'opacity-60 bg-muted/50',
        task.status === 'skipped' && 'opacity-40'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Checkbox
          checked={task.status === 'done'}
          onCheckedChange={(checked) =>
            onStatusChange(checked ? 'done' : 'pending')
          }
          className="mt-1"
        />

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{routine?.task_icon || '📌'}</span>
            <span
              className={cn(
                'font-medium',
                task.status === 'done' && 'line-through'
              )}
            >
              {task.task_name}
            </span>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            {routine?.is_fixed && routine.scheduled_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(routine.scheduled_time)}
              </span>
            )}
            {!routine?.is_fixed && (
              <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                Flexível
              </span>
            )}
            {routine?.estimated_duration && (
              <span>⏱️ ~{routine.estimated_duration}min</span>
            )}
          </div>

          {/* Expandido */}
          {isExpanded && (
            <div className="mt-3 space-y-3">
              {/* Subtarefas */}
              {hasSubtasks && (
                <div className="space-y-2">
                  {routine.subtasks!.map((subtask: Subtask) => (
                    <label
                      key={subtask.id}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Checkbox
                        checked={completedSubtasks.includes(subtask.id)}
                        onCheckedChange={() => onSubtaskToggle?.(subtask.id)}
                        className="h-4 w-4"
                      />
                      <span
                        className={cn(
                          completedSubtasks.includes(subtask.id) &&
                            'line-through text-muted-foreground'
                        )}
                      >
                        {subtask.text}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Nota */}
              {hasNote && (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  📝 {routine.note}
                </p>
              )}

              {/* Ações */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange('skipped')}
                  disabled={task.status !== 'pending'}
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Pular
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange('postponed')}
                  disabled={task.status !== 'pending'}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Adiar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Botão expandir */}
        {isExpandable && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Indicador de status */}
        {task.status === 'done' && (
          <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="h-4 w-4 text-success" />
          </div>
        )}
      </div>
    </Card>
  );
}
```

### 5.3. FocusMode (src/components/dashboard/FocusMode.tsx)

```typescript
'use client';

import { Sparkles, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRoutineStore } from '@/stores/routineStore';
import type { TaskLog, Routine } from '@/types';

interface FocusModeProps {
  nextTask: TaskLog | undefined;
  routine?: Routine;
  onComplete: () => void;
}

export function FocusMode({ nextTask, routine, onComplete }: FocusModeProps) {
  const { isFocusMode, toggleFocusMode } = useRoutineStore();

  if (!isFocusMode) {
    return (
      <Button
        onClick={toggleFocusMode}
        variant="outline"
        className="w-full"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        O que fazer agora?
      </Button>
    );
  }

  if (!nextTask) {
    return (
      <Card className="p-6 text-center">
        <p className="text-2xl mb-2">🎉</p>
        <p className="font-semibold">Você completou tudo!</p>
        <p className="text-sm text-muted-foreground mt-1">
          Parabéns pelo dia produtivo!
        </p>
        <Button onClick={toggleFocusMode} variant="outline" className="mt-4">
          <List className="h-4 w-4 mr-2" />
          Ver todas as tarefas
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-primary">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Agora:</p>
        <p className="text-4xl mb-2">{routine?.task_icon || '📌'}</p>
        <h2 className="text-xl font-bold">{nextTask.task_name}</h2>
        
        {routine?.estimated_duration && (
          <p className="text-sm text-muted-foreground mt-1">
            ⏱️ ~{routine.estimated_duration} minutos
          </p>
        )}

        <div className="flex gap-2 mt-6 justify-center">
          <Button onClick={onComplete}>
            Concluir ✓
          </Button>
          <Button onClick={toggleFocusMode} variant="outline">
            <List className="h-4 w-4 mr-2" />
            Ver tudo
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

### 5.4. EnergyMoodPicker (src/components/dashboard/EnergyMoodPicker.tsx)

```typescript
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { EnergyLevel, Mood } from '@/types';

interface EnergyMoodPickerProps {
  open: boolean;
  onClose: () => void;
  onSave: (energy: EnergyLevel, mood: Mood) => void;
}

const energyOptions: { value: EnergyLevel; icon: string; label: string }[] = [
  { value: 'high', icon: '🔋', label: 'Alta' },
  { value: 'medium', icon: '🔋', label: 'Média' },
  { value: 'low', icon: '🪫', label: 'Baixa' },
];

const moodOptions: { value: Mood; icon: string; label: string }[] = [
  { value: 'good', icon: '😊', label: 'Bem' },
  { value: 'meh', icon: '😐', label: 'Meh' },
  { value: 'difficult', icon: '😔', label: 'Difícil' },
];

export function EnergyMoodPicker({ open, onClose, onSave }: EnergyMoodPickerProps) {
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);

  const handleSave = () => {
    if (energy && mood) {
      onSave(energy, mood);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Como você está hoje?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Energia */}
          <div>
            <p className="text-sm font-medium mb-3 text-center">Energia</p>
            <div className="flex justify-center gap-3">
              {energyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setEnergy(option.value)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all',
                    energy === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Humor */}
          <div>
            <p className="text-sm font-medium mb-3 text-center">Humor</p>
            <div className="flex justify-center gap-3">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all',
                    mood === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Agora não
          </Button>
          <Button
            onClick={handleSave}
            disabled={!energy || !mood}
            className="flex-1"
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 5.5. PartnerCard (src/components/dashboard/PartnerCard.tsx)

```typescript
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ENERGY_LABELS, MOOD_LABELS } from '@/types';
import type { User, DailyStatus } from '@/types';

interface PartnerCardProps {
  partner: User;
  status: DailyStatus | null;
  progress: number;
}

export function PartnerCard({ partner, status, progress }: PartnerCardProps) {
  const initials = partner.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Link href="/partner">
      <Card className="p-4 hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={partner.avatar_url || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{partner.name}</p>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {status?.energy_level && (
                <span>{ENERGY_LABELS[status.energy_level].icon}</span>
              )}
              {status?.mood && (
                <span>{MOOD_LABELS[status.mood].icon}</span>
              )}
              <span>{progress}% hoje</span>
            </div>
          </div>

          <div className="w-16">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
```

---

## 6. COMPONENTES COMUNS

### 6.1. LoadingSpinner (src/components/common/LoadingSpinner.tsx)

```typescript
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <Loader2 className={cn('animate-spin text-primary', sizes[size], className)} />
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner size="lg" />
    </div>
  );
}
```

### 6.2. EmptyState (src/components/common/EmptyState.tsx)

```typescript
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

### 6.3. ConfirmDialog (src/components/common/ConfirmDialog.tsx)

```typescript
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUIStore } from '@/stores/uiStore';

export function ConfirmDialog() {
  const { isConfirmDialogOpen, confirmDialogData, closeConfirmDialog } = useUIStore();

  if (!confirmDialogData) return null;

  return (
    <AlertDialog open={isConfirmDialogOpen} onOpenChange={closeConfirmDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmDialogData.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmDialogData.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              confirmDialogData.onConfirm();
              closeConfirmDialog();
            }}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## 7. PÁGINAS

### 7.1. Login (src/app/(auth)/login/page.tsx)

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmail(email);
      setIsSent(true);
      toast.success('Link enviado! Verifique seu email.');
    } catch (error) {
      toast.error('Erro ao enviar link. Tente novamente.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <CardTitle>Verifique seu email</CardTitle>
            <CardDescription>
              Enviamos um link de acesso para <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSent(false)}
            >
              Usar outro email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-5xl mb-4">💑</div>
          <CardTitle>Rotina a Dois</CardTitle>
          <CardDescription>
            Organize a rotina do casal de forma gentil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Enviando...
                </>
              ) : (
                'Enviar link de acesso'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => signInWithGoogle()}
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Entrar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 7.2. Dashboard (src/app/(main)/page.tsx)

```typescript
'use client';

import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, CloudRain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { DayProgress } from '@/components/dashboard/DayProgress';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { FocusMode } from '@/components/dashboard/FocusMode';
import { PartnerCard } from '@/components/dashboard/PartnerCard';
import { EnergyMoodPicker } from '@/components/dashboard/EnergyMoodPicker';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useRoutines } from '@/hooks/useRoutines';
import { useTaskLogs } from '@/hooks/useTaskLogs';
import { useRoutineStore } from '@/stores/routineStore';
import { useUIStore } from '@/stores/uiStore';
import { formatDateExtended, checkIsToday } from '@/lib/utils';
import { addDays, subDays } from 'date-fns';

export default function DashboardPage() {
  const { partner } = useAuth();
  const { routinesForDay, fetchRoutines, isLoading: routinesLoading } = useRoutines();
  const { todayTasks, progress, nextTask, fetchTaskLogs, initializeDayTasks, setTaskStatus } = useTaskLogs();
  const { selectedDate, setSelectedDate, dailyStatus, isFocusMode } = useRoutineStore();
  const { isEnergyMoodOpen, openEnergyMood, closeEnergyMood } = useUIStore();

  const isToday = checkIsToday(selectedDate);

  // Carregar dados
  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  useEffect(() => {
    fetchTaskLogs(selectedDate);
  }, [selectedDate, fetchTaskLogs]);

  // Inicializar tarefas do dia
  useEffect(() => {
    if (routinesForDay.length > 0 && todayTasks.length === 0 && isToday) {
      initializeDayTasks(routinesForDay);
    }
  }, [routinesForDay, todayTasks.length, isToday, initializeDayTasks]);

  // Mostrar picker de energia/humor
  useEffect(() => {
    if (isToday && !dailyStatus && todayTasks.length > 0) {
      openEnergyMood();
    }
  }, [isToday, dailyStatus, todayTasks.length, openEnergyMood]);

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev'
      ? subDays(selectedDate, 1)
      : addDays(selectedDate, 1);
    setSelectedDate(newDate);
  };

  if (routinesLoading) {
    return <LoadingPage />;
  }

  const completedTasks = todayTasks.filter((t) => t.status === 'done').length;

  return (
    <PageContainer>
      {/* Navegação de data */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigateDay('prev')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <p className="font-semibold capitalize">{formatDateExtended(selectedDate)}</p>
          {!isToday && (
            <Button
              variant="link"
              size="sm"
              className="text-xs"
              onClick={() => setSelectedDate(new Date())}
            >
              Voltar para hoje
            </Button>
          )}
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => navigateDay('next')}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Status energia/humor */}
      {dailyStatus && (
        <div className="flex items-center justify-center gap-4 mb-4 text-sm">
          <span>🔋 {dailyStatus.energy_level}</span>
          <span>😊 {dailyStatus.mood}</span>
        </div>
      )}

      {/* Progresso */}
      {todayTasks.length > 0 && (
        <div className="mb-6">
          <DayProgress
            percentage={progress}
            totalTasks={todayTasks.length}
            completedTasks={completedTasks}
          />
        </div>
      )}

      {/* Botão dia difícil */}
      {isToday && todayTasks.length > 0 && (
        <Button
          variant="outline"
          className="w-full mb-4"
          onClick={() => {/* TODO: implementar */}}
        >
          <CloudRain className="h-4 w-4 mr-2" />
          Dia difícil
        </Button>
      )}

      {/* Modo foco ou lista de tarefas */}
      {isFocusMode ? (
        <FocusMode
          nextTask={nextTask}
          routine={routinesForDay.find((r) => r.id === nextTask?.routine_id)}
          onComplete={() => nextTask && setTaskStatus(nextTask.id, 'done')}
        />
      ) : (
        <>
          {/* Botão modo foco */}
          {todayTasks.length > 0 && (
            <div className="mb-4">
              <FocusMode
                nextTask={nextTask}
                routine={routinesForDay.find((r) => r.id === nextTask?.routine_id)}
                onComplete={() => nextTask && setTaskStatus(nextTask.id, 'done')}
              />
            </div>
          )}

          {/* Lista de tarefas */}
          {todayTasks.length === 0 ? (
            <EmptyState
              icon="📝"
              title="Nenhuma tarefa para hoje"
              description="Configure sua rotina para começar"
              action={{
                label: 'Criar rotina',
                onClick: () => {/* TODO: ir para rotinas */},
              }}
            />
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  routine={routinesForDay.find((r) => r.id === task.routine_id)}
                  onStatusChange={(status) => setTaskStatus(task.id, status)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Card do parceiro */}
      {partner && (
        <div className="mt-6">
          <PartnerCard
            partner={partner}
            status={null} // TODO: buscar status do parceiro
            progress={0} // TODO: buscar progresso do parceiro
          />
        </div>
      )}

      {/* Modal energia/humor */}
      <EnergyMoodPicker
        open={isEnergyMoodOpen}
        onClose={closeEnergyMood}
        onSave={(energy, mood) => {
          // TODO: salvar no banco
          console.log('Salvando:', energy, mood);
        }}
      />
    </PageContainer>
  );
}
```

---

## 8. PWA

### 8.1. Manifest (public/manifest.json)

```json
{
  "name": "Rotina a Dois",
  "short_name": "Rotina",
  "description": "Organize a rotina do casal de forma gentil",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#0891B2",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 8.2. Next Config (next.config.js)

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // suas outras configs
};

module.exports = withPWA(nextConfig);
```

---

## 9. MENSAGENS PRONTAS

### 9.1. Constantes de Mensagens (src/lib/messages.ts)

```typescript
export const MESSAGES = {
  // Saudações
  greetings: {
    morning: 'Bom dia',
    afternoon: 'Boa tarde',
    evening: 'Boa noite',
  },

  // Tarefas
  tasks: {
    completed: 'Boa! ✓',
    skipped: 'Tudo bem pular às vezes',
    postponed: 'Sem problemas, fica pra depois',
    allDone: 'Você completou tudo! 🎉',
  },

  // Progresso
  progress: {
    great: 'Você tá arrasando hoje!',
    good: 'Bom progresso!',
    keep_going: 'Continua assim!',
    its_ok: 'Cada passo conta 💙',
  },

  // Dia difícil
  difficultDay: {
    title: 'Tudo bem ir devagar hoje',
    description: 'O importante é cuidar de você. Foca só no essencial.',
    activated: 'Modo dia difícil ativado 💙',
  },

  // Parceiro
  partner: {
    great_job: 'Mandou bem hoje! 👍',
    you_can_do_it: 'Você consegue! 💪',
    need_help: 'Precisa de ajuda? 🤝',
    making_coffee: 'Vou fazer um café/chá ☕',
    im_here: 'Tô aqui com você 🫂',
  },

  // Streak
  streak: {
    new_record: 'Novo recorde! 🏆',
    keep_going: 'Não quebre a sequência!',
    lost: 'Tudo bem, vamos começar de novo 💪',
  },

  // Erros
  errors: {
    generic: 'Algo deu errado. Tente novamente.',
    network: 'Sem conexão. Verifique sua internet.',
    save: 'Erro ao salvar. Tente novamente.',
    load: 'Erro ao carregar. Tente novamente.',
  },

  // Sucesso
  success: {
    saved: 'Salvo com sucesso!',
    deleted: 'Removido com sucesso!',
    sent: 'Enviado!',
  },

  // Vazios
  empty: {
    tasks: 'Nenhuma tarefa para hoje',
    routines: 'Você ainda não tem rotinas',
    suggestions: 'Nenhuma sugestão pendente',
  },
};

export function getProgressMessage(percentage: number): string {
  if (percentage >= 80) return MESSAGES.progress.great;
  if (percentage >= 50) return MESSAGES.progress.good;
  if (percentage >= 25) return MESSAGES.progress.keep_going;
  return MESSAGES.progress.its_ok;
}
```

---

*Use estes templates como base. Adapte conforme necessário.*
*Não copie cegamente - entenda o código antes de usar.*
