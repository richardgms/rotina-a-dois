import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateExtended, checkIsToday } from '@/lib/utils';
import { addDays, subDays } from 'date-fns';

interface DashboardHeaderProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export function DashboardHeader({
    selectedDate,
    onDateChange,
}: DashboardHeaderProps) {
    const isToday = checkIsToday(selectedDate);

    const navigateDay = (direction: 'prev' | 'next') => {
        const newDate = direction === 'prev'
            ? subDays(selectedDate, 1)
            : addDays(selectedDate, 1);
        onDateChange(newDate);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex items-center justify-between w-full max-w-xs mb-2">
                <Button variant="ghost" size="icon" onClick={() => navigateDay('prev')} className="h-12 w-12 hover:bg-muted/50">
                    <ChevronLeft className="h-8 w-8 text-muted-foreground" />
                </Button>

                <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                    {isToday ? 'Hoje' : 'Dia'}
                </span>

                <Button variant="ghost" size="icon" onClick={() => navigateDay('next')} className="h-12 w-12 hover:bg-muted/50">
                    <ChevronRight className="h-8 w-8 text-muted-foreground" />
                </Button>
            </div>

            <div className="flex flex-col items-center gap-1">
                <h1 className="text-xl font-bold capitalize text-center">
                    {formatDateExtended(selectedDate).split(',')[0]}
                </h1>
                <span className="text-sm text-muted-foreground capitalize">
                    {formatDateExtended(selectedDate).split(',')[1]}
                </span>

                {!isToday && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs px-3 rounded-full mt-1 font-medium bg-primary/10 text-primary hover:bg-primary/20"
                        onClick={() => onDateChange(new Date())}
                    >
                        Voltar para hoje
                    </Button>
                )}
            </div>
        </div>
    );
}
