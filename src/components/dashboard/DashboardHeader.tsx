import { ChevronLeft, ChevronRight, CloudRain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateExtended, checkIsToday } from '@/lib/utils';
import { addDays, subDays } from 'date-fns';
import { ENERGY_LABELS, MOOD_LABELS } from '@/types';
import type { DailyStatus } from '@/types';

interface DashboardHeaderProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    dailyStatus: DailyStatus | null;
    onDifficultDayClick?: () => void;
    showDifficultDayButton?: boolean;
}

export function DashboardHeader({
    selectedDate,
    onDateChange,
    dailyStatus,
    onDifficultDayClick,
    showDifficultDayButton
}: DashboardHeaderProps) {
    const isToday = checkIsToday(selectedDate);

    const navigateDay = (direction: 'prev' | 'next') => {
        const newDate = direction === 'prev'
            ? subDays(selectedDate, 1)
            : addDays(selectedDate, 1);
        onDateChange(newDate);
    };

    return (
        <div className="mb-6">
            {/* Navegação de data */}
            <div className="flex items-center justify-between mb-4">
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
                            onClick={() => onDateChange(new Date())}
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
            {dailyStatus?.energy_level && dailyStatus?.mood && (
                <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                    <span>{ENERGY_LABELS[dailyStatus.energy_level].icon} {ENERGY_LABELS[dailyStatus.energy_level].label}</span>
                    <span>{MOOD_LABELS[dailyStatus.mood].icon} {MOOD_LABELS[dailyStatus.mood].label}</span>
                </div>
            )}

            {/* Botão dia difícil */}
            {showDifficultDayButton && onDifficultDayClick && (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={onDifficultDayClick}
                >
                    <CloudRain className="h-4 w-4 mr-2" />
                    Dia difícil
                </Button>
            )}
        </div>
    );
}
