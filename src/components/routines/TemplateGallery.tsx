'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getSupabaseClient } from '@/lib/supabase/client';
import { CATEGORY_LABELS } from '@/types';
import type { TaskTemplate, TaskCategory } from '@/types';

interface TemplateGalleryProps {
    onSelect: (template: TaskTemplate) => void;
}

export function TemplateGallery({ onSelect }: TemplateGalleryProps) {
    const [templates, setTemplates] = useState<TaskTemplate[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
    const supabase = getSupabaseClient();

    useEffect(() => {
        async function fetchTemplates() {
            const { data } = await supabase
                .from('task_templates')
                .select('*')
                .eq('is_system', true)
                .order('category');

            if (data) setTemplates(data as TaskTemplate[]);
        }
        fetchTemplates();
    }, [supabase]);

    const categories: (TaskCategory | 'all')[] = ['all', ...(Object.keys(CATEGORY_LABELS) as TaskCategory[])];

    const filtered = templates.filter((t) => {
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar tarefa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="flex gap-2 flex-wrap pb-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors outline-none focus:outline-none ring-0 focus:ring-0 border-none ${selectedCategory === cat
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                            }`}
                    >
                        {cat === 'all' ? 'Todos' : CATEGORY_LABELS[cat as TaskCategory]}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
                {filtered.map((template) => (
                    <Card
                        key={template.id}
                        className="p-3 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onSelect(template)}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{template.icon}</span>
                            <span className="text-sm font-medium line-clamp-2 leading-tight break-words">{template.name}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
