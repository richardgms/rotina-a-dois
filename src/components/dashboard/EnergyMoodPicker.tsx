'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { EnergyLevel, Mood } from '@/types';

interface EnergyMoodPickerProps {
    open: boolean;
    onClose: () => void;
    onSave: (energy: EnergyLevel, mood: Mood) => Promise<void> | void;
}

const energyOptions: { value: EnergyLevel; icon: string; label: string }[] = [
    { value: 'high', icon: '🔋', label: 'Alta' },
    { value: 'medium', icon: '🔋', label: 'Média' },
    { value: 'low', icon: '🪫', label: 'Baixa' },
];

const moodOptions: { value: Mood; icon: string; label: string }[] = [
    { value: 'good', icon: '😊', label: 'Bem' },
    { value: 'meh', icon: '😐', label: 'Meh' },
    { value: 'difficult', icon: '😔', label: 'Difícil' },
];

export function EnergyMoodPicker({ open, onClose, onSave }: EnergyMoodPickerProps) {
    const [energy, setEnergy] = useState<EnergyLevel | null>(null);
    const [mood, setMood] = useState<Mood | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (energy && mood) {
            try {
                setIsSaving(true);
                await onSave(energy, mood);
                onClose();
            } catch (error: unknown) {
                // Error is handled by the hook (logged)
                console.error("Save error:", error);
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                alert(`Erro ao salvar: ${errorMessage}`);
                setIsSaving(false);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Como você está hoje?
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Energia */}
                    <div>
                        <p className="text-sm font-medium mb-3 text-center">Energia</p>
                        <div className="flex justify-center gap-3">
                            {energyOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setEnergy(option.value)}
                                    className={cn(
                                        'flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all',
                                        energy === option.value
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                    )}
                                >
                                    <span className="text-2xl">{option.icon}</span>
                                    <span className="text-sm">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Humor */}
                    <div>
                        <p className="text-sm font-medium mb-3 text-center">Humor</p>
                        <div className="flex justify-center gap-3">
                            {moodOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setMood(option.value)}
                                    className={cn(
                                        'flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all',
                                        mood === option.value
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                    )}
                                >
                                    <span className="text-2xl">{option.icon}</span>
                                    <span className="text-sm">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Agora não
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!energy || !mood || isSaving}
                        className="flex-1"
                    >
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
