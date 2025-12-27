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
            <div className="flex items-center justify-around h-14">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors',
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-[10px]">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
