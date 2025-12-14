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
