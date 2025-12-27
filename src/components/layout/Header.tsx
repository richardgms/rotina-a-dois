'use client';

import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { getGreeting } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationBell } from '@/components/common/NotificationBell';

interface HeaderProps {
    streak?: number;
}

export function Header({ streak = 0 }: HeaderProps) {
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container flex h-14 items-center justify-between px-4">
                <div>
                    {!mounted ? (
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-32" />
                        </div>
                    ) : (
                        <h1 className="text-lg font-semibold">
                            {user?.name ? (
                                <>{getGreeting()}, {user.name.split(' ')[0]}!</>
                            ) : (
                                <Skeleton className="h-6 w-32" />
                            )}
                        </h1>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {streak > 0 && (
                        <div className="flex items-center gap-1 text-orange-500">
                            <Flame className="h-5 w-5 fill-orange-500" />
                            <span className="font-bold">{streak}</span>
                        </div>
                    )}
                    <NotificationBell />
                </div>
            </div>
        </header>
    );
}
