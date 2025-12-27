'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Moon, Sun, User, Bell, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useUIStore } from '@/stores/uiStore';
import { getSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { user, partner, signOut, isLoading, unpairPartner } = useAuth();
    const { theme, setTheme } = useTheme();
    const { openConfirmDialog } = useUIStore();
    const [name, setName] = useState('');
    const supabase = getSupabaseClient();

    // Sincronizar nome quando user carregar
    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user?.name]);

    const handleSaveName = async () => {
        if (!user || !name.trim()) return;

        try {
            const { error } = await supabase
                .from('users')
                .update({ name: name.trim() })
                .eq('id', user.id);

            if (error) throw error;
            toast.success('Nome atualizado!');
        } catch (error) {
            toast.error('Erro ao salvar');
        }
    };

    const handleLogout = () => {
        openConfirmDialog({
            title: 'Sair da conta?',
            description: 'Você precisará fazer login novamente.',
            onConfirm: signOut,
        });
    };

    // Skeleton durante carregamento
    if (isLoading) {
        return (
            <PageContainer>
                <Skeleton className="h-8 w-48 mb-6" />
                <Card className="p-4 mb-4">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-10 w-full mb-2" />
                    <Skeleton className="h-4 w-32" />
                </Card>
                <Card className="p-4 mb-4">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-10 w-full" />
                </Card>
                <Card className="p-4 mb-4">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-4 w-48" />
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <h1 className="text-2xl font-bold mb-6">Configurações</h1>

            {/* Perfil */}
            <Card className="p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5" />
                    <h2 className="font-semibold">Perfil</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome</Label>
                        <div className="flex gap-2 mt-1">
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Button onClick={handleSaveName}>Salvar</Button>
                        </div>
                    </div>

                    <div>
                        <Label>Email</Label>
                        <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                    </div>
                </div>
            </Card>

            {/* Aparência */}
            <Card className="p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                    {theme === 'ocean' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <h2 className="font-semibold">Aparência</h2>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Tema</p>
                        <p className="text-sm text-muted-foreground">
                            {theme === 'ocean' ? 'Oceano (claro)' : 'Midnight (escuro)'}
                        </p>
                    </div>
                    <Switch
                        checked={theme === 'midnight'}
                        onCheckedChange={(checked) => {
                            setTheme(checked ? 'midnight' : 'ocean');
                        }}
                    />
                </div>
            </Card>

            {/* Parceiro */}
            <Card className="p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5" />
                    <h2 className="font-semibold">Parceiro</h2>
                </div>

                {partner ? (
                    <div>
                        <div className="mb-4">
                            <p className="font-medium">{partner.name}</p>
                            <p className="text-sm text-muted-foreground">{partner.email}</p>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                                openConfirmDialog({
                                    title: 'Desvincular parceiro?',
                                    description: 'Isso removerá a conexão entre vocês. O histórico individual será mantido.',
                                    onConfirm: unpairPartner,
                                });
                            }}
                        >
                            Desvincular
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">Nenhum parceiro vinculado</p>
                        <Button asChild variant="secondary" className="w-full">
                            <Link href="/pairing">
                                Vincular Parceiro
                            </Link>
                        </Button>
                    </div>
                )}
            </Card>

            {/* Código de pareamento */}
            <Card className="p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="h-5 w-5" />
                    <h2 className="font-semibold">Seu código</h2>
                </div>

                <code className="text-lg font-mono font-bold tracking-widest bg-muted px-3 py-1 rounded">
                    {user?.pairing_code || '------'}
                </code>
            </Card>

            {/* Sair */}
            <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair da conta
            </Button>
        </PageContainer>
    );
}
