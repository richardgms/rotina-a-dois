'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';
import { Copy, Check, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PairingPage() {
    const [partnerCode, setPartnerCode] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { user } = useAuth();
    const [myCode, setMyCode] = useState('');
    const supabase = getSupabaseClient();

    useEffect(() => {
        if (user?.pairing_code) {
            setMyCode(user.pairing_code);
            return;
        }

        async function fetchMyCode() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data } = await supabase
                    .from('users')
                    .select('pairing_code')
                    .eq('id', authUser.id)
                    .single();

                if (data?.pairing_code) {
                    setMyCode(data.pairing_code);
                }
            }
        }
        fetchMyCode();
    }, [user, supabase]);

    const handleCopy = async () => {
        const codeToCopy = myCode || user?.pairing_code;
        if (!codeToCopy) return;
        await navigator.clipboard.writeText(codeToCopy);
        setCopied(true);
        toast.success('Código copiado!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!partnerCode.trim()) return;

        setIsLoading(true);
        setStatusMessage(null);

        try {
            const { data, error } = await supabase.rpc('send_pairing_request', {
                partner_code_input: partnerCode.trim().toUpperCase()
            });

            if (error) throw error;

            if (data.success) {
                toast.success(data.message);
                setStatusMessage(data.message);
                setPartnerCode('');
            } else {
                toast.error(data.error);
                setStatusMessage(`Erro: ${data.error}`);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Erro ao enviar solicitação');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="text-5xl mb-4">💑</div>
                    <CardTitle>Conectar com Parceiro(a)</CardTitle>
                    <CardDescription>
                        Compartilhe seu código ou adicione o código do seu amor para enviar uma solicitação.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Meu código */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-center">Seu código:</p>
                        <div className="flex items-center justify-center gap-2">
                            <code className="text-2xl font-mono font-bold tracking-widest bg-muted px-4 py-2 rounded-lg">
                                {myCode || user?.pairing_code || '------'}
                            </code>
                            <Button variant="outline" size="icon" onClick={handleCopy}>
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            Envie este código para seu parceiro(a)
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">ou</span>
                        </div>
                    </div>

                    {/* Status Message */}
                    {statusMessage && (
                        <Alert className={statusMessage.startsWith('Erro') ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                            <Info className="h-4 w-4" />
                            <AlertTitle>{statusMessage.startsWith('Erro') ? 'Atenção' : 'Sucesso'}</AlertTitle>
                            <AlertDescription>
                                {statusMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Inserir código do parceiro */}
                    <form onSubmit={handleSendRequest} className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-center">Código do parceiro(a):</p>
                            <Input
                                value={partnerCode}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPartnerCode(e.target.value.toUpperCase())}
                                placeholder="XXXXXX"
                                className="text-center text-lg font-mono tracking-widest"
                                maxLength={6}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading || partnerCode.length < 6}>
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Enviando solicitação...
                                </>
                            ) : (
                                'Enviar Solicitação 💕'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
