'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CATEGORY_LABELS, DURATION_OPTIONS, REMINDER_OPTIONS } from '@/types'; // Assuming these exist
import type { Routine, TaskCategory, FlexiblePeriod } from '@/types';
import { Plus, X } from 'lucide-react';
import { TemplateGallery } from './TemplateGallery';
import { cn } from '@/lib/utils';


interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: Partial<Routine>) => Promise<void>;
    initialData?: Routine | null;
}

export function TaskForm({ open, onClose, onSave, initialData }: TaskFormProps) {
    const [step, setStep] = useState<'template' | 'details'>(initialData ? 'details' : 'template');
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [name, setName] = useState(initialData?.task_name || '');
    const [icon, setIcon] = useState(initialData?.task_icon || '📌');
    const [category, setCategory] = useState<TaskCategory>(initialData?.category || 'morning');
    const [isFixed, setIsFixed] = useState(initialData?.is_fixed || false);
    const [scheduledTime, setScheduledTime] = useState(initialData?.scheduled_time || '');
    const [flexiblePeriod, setFlexiblePeriod] = useState<FlexiblePeriod>(initialData?.flexible_period || 'morning');
    const [duration, setDuration] = useState(initialData?.estimated_duration || 15);
    const [reminder, setReminder] = useState(initialData?.reminder_minutes || 10);
    const [transitionWarning, setTransitionWarning] = useState(initialData?.transition_warning ?? true);
    const [note, setNote] = useState(initialData?.note || '');
    const [subtasks, setSubtasks] = useState<{ id: string; text: string; order: number }[]>(
        initialData?.subtasks || []
    );
    const [newSubtask, setNewSubtask] = useState('');

    const handleSave = async () => {
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            await onSave({
                task_name: name,
                task_icon: icon,
                category,
                is_fixed: isFixed,
                scheduled_time: isFixed ? scheduledTime : null,
                flexible_period: isFixed ? null : flexiblePeriod,
                estimated_duration: duration,
                reminder_minutes: reminder,
                transition_warning: transitionWarning,
                note: note.trim() || null,
                subtasks: subtasks.length > 0 ? subtasks : null,
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            setSubtasks([...subtasks, { id: crypto.randomUUID(), text: newSubtask.trim(), order: subtasks.length }]);
            setNewSubtask('');
        }
    };

    const handleRemoveSubtask = (id: string) => {
        setSubtasks(subtasks.filter((s) => s.id !== id));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle>
                        {initialData ? 'Editar Tarefa' : step === 'template' ? 'Escolher Modelo' : 'Nova Tarefa'}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6">
                    {step === 'template' && !initialData ? (
                        <div className="space-y-4">
                            <TemplateGallery
                                onSelect={(template) => {
                                    setName(template.name);
                                    setIcon(template.icon);
                                    setCategory(template.category);
                                    setDuration(template.default_duration);
                                    if (template.suggested_subtasks) {
                                        // Handle simple string[] or object[] if complex
                                        const subs = Array.isArray(template.suggested_subtasks)
                                            ? template.suggested_subtasks.map((t: string, i: number) => ({ id: crypto.randomUUID(), text: t, order: i }))
                                            : [];
                                        setSubtasks(subs);
                                    }
                                    setStep('details');
                                }}
                            />
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">ou</span></div>
                            </div>
                            <Button variant="outline" className="w-full" onClick={() => setStep('details')}>
                                Criar do zero
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Nome e Ícone */}
                            <div className="grid grid-cols-[60px_1fr] gap-3">
                                <div className="space-y-2">
                                    <Label>Ícone</Label>
                                    <Input
                                        value={icon}
                                        onChange={(e) => setIcon(e.target.value)}
                                        className="text-center text-2xl p-2 h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nome da tarefa</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex: Lavar louça"
                                    />
                                </div>
                            </div>

                            {/* Categoria */}
                            <div className="space-y-2">
                                <Label>Categoria</Label>
                                <div className="flex flex-wrap gap-2">
                                    {(Object.entries(CATEGORY_LABELS) as [TaskCategory, string][]).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => setCategory(key)}
                                            className={cn(
                                                "px-3 py-1 rounded-full text-sm border transition-colors",
                                                category === key ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
                                            )}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Horário */}
                            <div className="space-y-4 border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <Label>Horário Fixo?</Label>
                                    <Switch checked={isFixed} onCheckedChange={setIsFixed} />
                                </div>

                                {isFixed ? (
                                    <div className="space-y-3">
                                        <Label>Horário</Label>
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Hora */}
                                            <div className="flex flex-col items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const [h, m] = (scheduledTime || '08:00').split(':').map(Number);
                                                        const newH = h >= 23 ? 0 : h + 1;
                                                        setScheduledTime(`${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
                                                    }}
                                                    className="w-12 h-10 rounded-lg bg-muted hover:bg-muted/80 text-lg font-bold transition-colors"
                                                >
                                                    ▲
                                                </button>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={2}
                                                    value={(scheduledTime || '08:00').split(':')[0]}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                                        const h = Math.min(23, Number(val) || 0);
                                                        const m = (scheduledTime || '08:00').split(':')[1];
                                                        setScheduledTime(`${String(h).padStart(2, '0')}:${m}`);
                                                    }}
                                                    className="w-16 h-14 text-center text-3xl font-bold rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const [h, m] = (scheduledTime || '08:00').split(':').map(Number);
                                                        const newH = h <= 0 ? 23 : h - 1;
                                                        setScheduledTime(`${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
                                                    }}
                                                    className="w-12 h-10 rounded-lg bg-muted hover:bg-muted/80 text-lg font-bold transition-colors"
                                                >
                                                    ▼
                                                </button>
                                            </div>

                                            <span className="text-3xl font-bold text-muted-foreground">:</span>

                                            {/* Minuto */}
                                            <div className="flex flex-col items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const [h, m] = (scheduledTime || '08:00').split(':').map(Number);
                                                        const newM = m >= 55 ? 0 : m + 5;
                                                        setScheduledTime(`${String(h).padStart(2, '0')}:${String(newM).padStart(2, '0')}`);
                                                    }}
                                                    className="w-12 h-10 rounded-lg bg-muted hover:bg-muted/80 text-lg font-bold transition-colors"
                                                >
                                                    ▲
                                                </button>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={2}
                                                    value={(scheduledTime || '08:00').split(':')[1]}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                                        const m = Math.min(59, Number(val) || 0);
                                                        const h = (scheduledTime || '08:00').split(':')[0];
                                                        setScheduledTime(`${h}:${String(m).padStart(2, '0')}`);
                                                    }}
                                                    className="w-16 h-14 text-center text-3xl font-bold rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const [h, m] = (scheduledTime || '08:00').split(':').map(Number);
                                                        const newM = m <= 0 ? 55 : m - 5;
                                                        setScheduledTime(`${String(h).padStart(2, '0')}:${String(newM).padStart(2, '0')}`);
                                                    }}
                                                    className="w-12 h-10 rounded-lg bg-muted hover:bg-muted/80 text-lg font-bold transition-colors"
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label>Período sugerido</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['morning', 'afternoon', 'evening', 'anytime'].map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => setFlexiblePeriod(p as FlexiblePeriod)}
                                                    className={cn(
                                                        "px-3 py-2 rounded-md text-sm border transition-colors",
                                                        flexiblePeriod === p ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
                                                    )}
                                                >
                                                    {p === 'morning' ? 'Manhã' : p === 'afternoon' ? 'Tarde' : p === 'evening' ? 'Noite' : 'Qualquer hora'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Duração e Lembrete */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Duração</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                    >
                                        {DURATION_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Lembrete</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={reminder}
                                        onChange={(e) => setReminder(Number(e.target.value))}
                                    >
                                        {REMINDER_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Subtarefas */}
                            <div className="space-y-3">
                                <Label>Subtarefas</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Nova subtarefa..."
                                        value={newSubtask}
                                        onChange={(e) => setNewSubtask(e.target.value)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddSubtask()}
                                    />
                                    <Button onClick={handleAddSubtask} size="icon" variant="secondary">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {subtasks.map((sub) => (
                                        <div key={sub.id} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                                            <span className="flex-1 text-sm">{sub.text}</span>
                                            <button onClick={() => handleRemoveSubtask(sub.id)} className="text-muted-foreground hover:text-destructive">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Nota */}
                            <div className="space-y-2">
                                <Label>Nota / Observação</Label>
                                <Textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Detalhes extras..."
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 border-t gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    {step === 'details' && (
                        <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
