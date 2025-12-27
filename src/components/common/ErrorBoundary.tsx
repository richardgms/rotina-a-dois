'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in zoom-in duration-300">
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
                        <span className="text-4xl">😵</span>
                    </div>

                    <h2 className="text-xl font-bold mb-2">Ops, algo deu errado!</h2>

                    <p className="mb-6 text-muted-foreground max-w-sm">
                        {this.state.error?.message || 'Ocorreu um erro inesperado ao carregar esta parte do aplicativo.'}
                    </p>

                    <Button
                        onClick={() => {
                            this.setState({ hasError: false, error: undefined });
                            window.location.reload();
                        }}
                        className="gap-2"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Tentar novamente
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
