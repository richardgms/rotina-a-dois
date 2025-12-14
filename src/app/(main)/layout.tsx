'use client';

import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useTheme } from '@/hooks/useTheme';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Inicializa o tema ao carregar o layout
    useTheme();

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>{children}</main>
            <BottomNav />
            <ConfirmDialog />
        </div>
    );
}
