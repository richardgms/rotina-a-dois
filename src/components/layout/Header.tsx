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
