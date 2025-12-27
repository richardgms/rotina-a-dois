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
            <Card className="p-4 hover:bg-accent/30 transition-colors border-[0.5px] shadow-none bg-card/20">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={partner.avatar_url || undefined} alt={partner.name} />
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
