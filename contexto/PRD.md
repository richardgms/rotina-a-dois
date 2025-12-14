# PRD - Rotina a Dois

## Documento de Requisitos do Produto
**Versão:** 1.0
**Data:** Dezembro 2024
**Status:** Aprovado para Desenvolvimento

---

## 1. Visão Geral

### 1.1. O que é
**Rotina a Dois** é um aplicativo web (PWA) para casais criarem, gerenciarem e acompanharem suas rotinas diárias juntos. Focado em acessibilidade para pessoas neurodivergentes (TDAH e Autismo).

### 1.2. Problema
Casais neurodivergentes têm dificuldade em manter rotinas consistentes. TDAH causa dificuldade com foco, noção de tempo e iniciar tarefas. Autismo requer previsibilidade e avisos de transição. Sem uma ferramenta adequada, a rotina não acontece.

### 1.3. Solução
Um app simples, visual e gentil que:
- Estrutura o dia com clareza
- Envia lembretes inteligentes
- Permite acompanhar o parceiro
- Oferece feedback sem julgamento
- Adapta-se a dias difíceis

### 1.4. Público-Alvo
- Casais que moram juntos
- Pessoas com TDAH e/ou Autismo
- Qualquer casal que quer organizar a rotina

### 1.5. Plataforma
- PWA (Progressive Web App)
- Mobile-first (otimizado para celular)
- Funciona em qualquer navegador
- Instalável na tela inicial
- Notificações push

---

## 2. Funcionalidades

### 2.1. Autenticação

#### 2.1.1. Login
- Email + Magic Link (sem senha)
- Login com Google (opcional)
- Sessão persistente (não desloga sozinho)

#### 2.1.2. Pareamento
- Após primeiro login, usuário gera código de 6 dígitos
- Parceiro(a) insere código para vincular contas
- Uma vez pareados, ficam conectados permanentemente
- Opção de desvincular nas configurações

#### 2.1.3. Dados do Usuário
- Nome de exibição
- Foto (opcional)
- Tema preferido (Oceano ou Midnight)
- ID do parceiro vinculado

---

### 2.2. Dashboard - Meu Dia (Tela Principal)

#### 2.2.1. Cabeçalho
- Saudação personalizada ("Bom dia, [Nome]!")
- Data atual por extenso
- Indicador de energia/humor do dia (se preenchido)
- Streak atual (🔥 X dias seguidos)

#### 2.2.2. Indicador de Energia/Humor
Ao abrir o app pela primeira vez no dia:
- Modal pergunta como está se sentindo
- **Energia:** 🔋 Alta | 🔋 Média | 🪫 Baixa
- **Humor:** 😊 Bem | 😐 Meh | 😔 Difícil
- Pode pular (botão "Agora não")
- Pode editar depois
- Parceiro vê esse status

#### 2.2.3. Barra de Progresso
- Porcentagem do dia completada
- Visual: barra que preenche
- Cores: vazio → em progresso → completo

#### 2.2.4. Botão "O Que Fazer Agora?"
- Destaque no topo
- Ao clicar: esconde todas as tarefas, mostra só a próxima
- Modo foco para reduzir overwhelm
- Botão "Ver tudo" para voltar à lista completa

#### 2.2.5. Lista de Tarefas do Dia
Cada tarefa mostra:
- Checkbox para marcar como feito
- Ícone da categoria
- Nome da tarefa
- Horário (se fixa) ou "Flexível"
- Tempo estimado (⏱️ ~15min)
- Indicador se tem subtarefas
- Status: ⬜ Pendente | ✅ Feito | ⏭️ Pulei | 🔄 Adiado

#### 2.2.6. Ações em Cada Tarefa
Ao tocar/clicar na tarefa:
- Expandir subtarefas (se houver)
- Ver nota (se houver)
- Marcar como: Feito / Pulei / Adiar
- Editar (vai para edição de rotina)

#### 2.2.7. Navegação de Dias
- Setas ← e → para navegar entre dias
- Botão "Hoje" para voltar ao dia atual
- Pode ver dias passados (histórico)
- Pode ver dias futuros (planejamento)

#### 2.2.8. Botão "Dia Difícil"
- Ativa rotina mínima de emergência
- Só tarefas essenciais: comer, remédio, higiene
- Visual diferente (mais suave)
- Mensagem de acolhimento
- Não conta negativamente no histórico

#### 2.2.9. Acesso Rápido ao Parceiro
- Mini card no topo ou bottom
- Foto + nome do parceiro
- Energia/humor dele(a) hoje
- % de progresso dele(a)
- Toque = vai para tela do parceiro

---

### 2.3. Visualização Semanal

#### 2.3.1. Layout
- 7 colunas (Dom a Sáb) ou (Seg a Dom)
- Cada dia mostra:
  - Data
  - Quantidade de tarefas
  - % cumprido (se passado)
  - Indicador de energia (bolinha colorida)

#### 2.3.2. Interação
- Toque no dia = abre detalhes do dia
- Swipe horizontal = navega entre semanas
- Indicador visual de "hoje"

#### 2.3.3. Planejamento
- Pode adicionar tarefas avulsas em dias específicos
- Pode ver/editar rotina padrão de cada dia

---

### 2.4. Visualização Mensal (Calendário)

#### 2.4.1. Layout
- Calendário tradicional
- Mês e ano no topo
- Navegação entre meses

#### 2.4.2. Indicadores por Dia
- 🟢 Verde: >80% cumprido
- 🟡 Amarelo: 50-80% cumprido
- 🔴 Vermelho: <50% cumprido
- ⚪ Cinza: sem rotina definida
- 🔵 Azul: dia futuro com rotina
- ⏸️ Cinza escuro: rotina pausada

#### 2.4.3. Interação
- Toque no dia = abre detalhes
- Toque longo = adicionar tarefa avulsa
- Pode ver calendário do parceiro também

---

### 2.5. Editor de Rotinas

#### 2.5.1. Seleção de Dia
- Abas ou dropdown: Seg | Ter | Qua | Qui | Sex | Sáb | Dom
- Opção "Dias Úteis" (Seg-Sex)
- Opção "Fim de Semana" (Sáb-Dom)
- Opção "Todos os Dias"

#### 2.5.2. Lista de Tarefas da Rotina
- Ordenadas por horário
- Drag and drop para reordenar
- Botão + para adicionar
- Swipe para deletar

#### 2.5.3. Adicionar/Editar Tarefa
Modal ou tela com:

**Informações Básicas:**
- Nome da tarefa (texto livre ou selecionar template)
- Ícone (galeria de ícones)
- Categoria (dropdown)

**Horário:**
- Tipo: 📌 Fixa ou 🔄 Flexível
- Se fixa: seletor de horário
- Se flexível: período (Manhã/Tarde/Noite) ou "Qualquer hora"

**Tempo e Lembrete:**
- Tempo estimado (15min, 30min, 1h, etc)
- Lembrete: X minutos antes (0, 5, 10, 15, 30, 60)
- Aviso de transição: Sim/Não (notifica 10min antes)

**Subtarefas (opcional):**
- Botão "+ Adicionar passo"
- Lista de subtarefas com checkbox
- Reordenar com drag and drop

**Nota (opcional):**
- Campo de texto livre
- Dicas, instruções, contexto

#### 2.5.4. Templates de Tarefas
Botão "Usar Template" abre galeria:

**Categorias de Templates:**

*Manhã:*
- ☀️ Acordar
- 💧 Tomar água
- 💊 Tomar remédios
- 🍳 Café da manhã
- 🛏️ Arrumar a cama
- 👔 Se arrumar
- 🪥 Escovar dentes
- 🧴 Skincare manhã

*Limpeza:*
- 🍽️ Lavar louça
- 🧹 Varrer casa
- 🧽 Passar pano
- 🚽 Limpar banheiro
- 🗑️ Tirar lixo
- 🛋️ Organizar sala
- 🧺 Lavar roupa
- 👕 Estender roupa
- 👚 Recolher/dobrar roupa

*Cozinha:*
- 🥗 Preparar almoço
- 🍝 Preparar janta
- 🔥 Limpar fogão
- ❄️ Organizar geladeira
- 🛒 Lista de compras

*Noite:*
- 👔 Preparar roupa do dia seguinte
- 🧴 Skincare noite
- 💊 Remédios da noite
- 📱 Desligar eletrônicos
- 🌙 Hora de dormir

*Autocuidado:*
- 🚿 Banho
- 🪥 Escovar dentes
- 💧 Beber água (lembrete recorrente)
- 🏃 Exercício físico
- 🧘 Momento de descanso
- 📖 Ler
- 🎮 Lazer

*Trabalho/Estudo:*
- 💼 Início do trabalho
- ☕ Pausa
- 📚 Estudar
- 📧 Checar emails

#### 2.5.5. Clonar Rotina
- Botão "Copiar para outros dias"
- Seleciona dias de destino
- Opção: substituir ou adicionar às existentes

#### 2.5.6. Rotina "Dia Difícil"
- Rotina especial editável
- Pré-populada com essenciais:
  - Comer algo
  - Tomar remédios
  - Higiene básica
  - Beber água
- Ativada manualmente quando necessário

---

### 2.6. Tela do Parceiro(a)

#### 2.6.1. Visualização
- Mesmo layout do "Meu Dia"
- Mas é a rotina do parceiro
- Só visualização (não edita rotina dele)

#### 2.6.2. Status do Parceiro
- Energia/humor de hoje
- % de progresso
- Última atividade (há quanto tempo abriu o app)

#### 2.6.3. Ações de Apoio
Botões de feedback rápido:
- 👍 "Mandou bem hoje!"
- 💪 "Você consegue!"
- 🤝 "Precisa de ajuda?"
- ☕ "Vou fazer um café/chá"
- 🫂 "Tô aqui com você"

Ao clicar: envia notificação pro parceiro com a mensagem.

#### 2.6.4. Avaliar Cumprimento
- Pode marcar tarefas do parceiro como "Vi que fez ✓"
- Útil quando um não marcou mas o outro viu que fez
- Fica registrado quem marcou

#### 2.6.5. Assumir Tarefa
- Botão "Eu faço essa"
- Transfere tarefa do parceiro pra você
- Fica registrado no histórico

#### 2.6.6. Enviar Sugestão
- Botão "Sugerir tarefa"
- Abre modal para escrever sugestão
- Vai pra fila de sugestões do parceiro

---

### 2.7. Sugestões

#### 2.7.1. Lista de Sugestões Recebidas
- Sugestões do parceiro para você
- Cada uma mostra:
  - Quem enviou
  - Data/hora
  - Conteúdo da sugestão
  - Botões: ✅ Aceitar | ❌ Recusar

#### 2.7.2. Aceitar Sugestão
- Abre editor de tarefa
- Pré-preenche com a sugestão
- Você ajusta horário, dia, etc
- Salva na sua rotina

#### 2.7.3. Recusar Sugestão
- Pode adicionar motivo (opcional)
- Remove da lista
- Notifica parceiro (gentilmente)

#### 2.7.4. Enviar Sugestão
- Texto livre
- Ou selecionar template
- Enviar para parceiro

---

### 2.8. Pausar Rotina

#### 2.8.1. Ativar Pausa
- Nas configurações ou atalho no dashboard
- Seleciona data de início e fim
- Motivo (opcional): Viagem, Doença, Folga, Outro

#### 2.8.2. Durante a Pausa
- Não envia notificações
- Dias pausados ficam cinza no calendário
- Não afeta streak (congela)
- Mensagem no dashboard: "Rotina pausada até [data]"

#### 2.8.3. Encerrar Pausa
- Automático na data fim
- Ou manual (botão "Voltar à rotina")

---

### 2.9. Notificações

#### 2.9.1. Tipos de Notificação

**Lembretes de Tarefa:**
- X minutos antes do horário
- Título: nome da tarefa
- Corpo: "Em X minutos" ou "Agora!"

**Aviso de Transição:**
- 10 minutos antes de tarefa fixa
- Título: "Próxima tarefa"
- Corpo: "Em 10 min: [tarefa]"

**Tarefa Atrasada:**
- Se passou do horário e não marcou
- Gentil: "Ei, tudo bem? [Tarefa] tá pendente"
- Botões: "Já fiz" | "Pular"

**Feedback do Parceiro:**
- Quando parceiro envia mensagem de apoio
- Título: "[Nome] enviou:"
- Corpo: a mensagem

**Sugestão Recebida:**
- Quando parceiro sugere tarefa
- Título: "Nova sugestão"
- Corpo: "[Nome] sugeriu algo pra você"

#### 2.9.2. Configuração de Notificações
- Ligar/desligar por tipo
- Horário de não perturbe (ex: 22h-7h)
- Som ligado/desligado
- Vibração ligado/desligado

---

### 2.10. Histórico e Estatísticas

#### 2.10.1. Visão no Calendário
- Cores indicam performance de cada dia
- Histórico de todos os meses anteriores

#### 2.10.2. Detalhes do Dia Passado
- Lista de tarefas com status final
- Quem marcou cada uma
- Tarefas assumidas pelo parceiro
- Energia/humor do dia

#### 2.10.3. Streak
- Contador de dias consecutivos
- Um dia conta se ≥50% cumprido
- Pausa não quebra streak
- Recorde pessoal salvo

#### 2.10.4. Resumo Simples (sem overload)
- Esta semana: X% cumprido
- Este mês: X% cumprido
- Tarefas mais puladas (top 3)
- Nada muito elaborado

---

### 2.11. Configurações

#### 2.11.1. Perfil
- Nome de exibição
- Foto (upload ou câmera)
- Email (somente visualização)

#### 2.11.2. Aparência
- Tema: Oceano 🌊 ou Midnight 🌙
- Tamanho da fonte: Normal / Grande
- Primeiro dia da semana: Domingo / Segunda

#### 2.11.3. Notificações
- Ligar/desligar geral
- Por tipo (lembretes, transição, parceiro)
- Horário silencioso

#### 2.11.4. Parceiro
- Nome do parceiro vinculado
- Botão "Desvincular" (com confirmação)
- Gerar novo código de pareamento

#### 2.11.5. Dados
- Exportar dados (JSON)
- Limpar histórico
- Excluir conta

---

## 3. Design System

### 3.1. Tema Oceano 🌊 (para ela)

```css
--primary: #0891B2;        /* Ciano */
--primary-light: #22D3EE;  /* Ciano claro */
--primary-dark: #0E7490;   /* Ciano escuro */
--background: #ECFEFF;     /* Fundo principal */
--surface: #FFFFFF;        /* Cards */
--text-primary: #164E63;   /* Texto principal */
--text-secondary: #64748B; /* Texto secundário */
--success: #10B981;        /* Verde */
--warning: #F59E0B;        /* Amarelo */
--error: #EF4444;          /* Vermelho */
--border: #A5F3FC;         /* Bordas */
```

### 3.2. Tema Midnight 🌙 (para ele)

```css
--primary: #3B82F6;        /* Azul */
--primary-light: #60A5FA;  /* Azul claro */
--primary-dark: #1E3A5F;   /* Azul escuro */
--background: #0F172A;     /* Fundo principal */
--surface: #1E293B;        /* Cards */
--text-primary: #E2E8F0;   /* Texto principal */
--text-secondary: #94A3B8; /* Texto secundário */
--success: #10B981;        /* Verde */
--warning: #F59E0B;        /* Amarelo */
--error: #EF4444;          /* Vermelho */
--border: #334155;         /* Bordas */
```

### 3.3. Tipografia

```css
--font-family: 'Inter', system-ui, sans-serif;
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
--font-size-2xl: 1.5rem;   /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
```

### 3.4. Espaçamento

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

### 3.5. Bordas

```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Circular */
```

### 3.6. Sombras

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

### 3.7. Ícones
- Biblioteca: Lucide React
- Tamanho padrão: 20px
- Tamanho pequeno: 16px
- Tamanho grande: 24px

---

## 4. Estrutura de Dados (Supabase)

### 4.1. Tabela: users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  partner_id UUID REFERENCES users(id),
  pairing_code TEXT UNIQUE,
  theme TEXT DEFAULT 'ocean' CHECK (theme IN ('ocean', 'midnight')),
  font_size TEXT DEFAULT 'normal' CHECK (font_size IN ('normal', 'large')),
  first_day_of_week INTEGER DEFAULT 0, -- 0=domingo, 1=segunda
  notifications_enabled BOOLEAN DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2. Tabela: task_templates

```sql
CREATE TABLE task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  default_duration INTEGER DEFAULT 15, -- minutos
  suggested_subtasks JSONB, -- array de strings
  is_system BOOLEAN DEFAULT true, -- templates do sistema vs criados pelo usuário
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3. Tabela: routines

```sql
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0-6 (dom-sab) ou 7=dia difícil
  task_name TEXT NOT NULL,
  task_icon TEXT DEFAULT '📌',
  category TEXT,
  is_fixed BOOLEAN DEFAULT false, -- fixa vs flexível
  scheduled_time TIME, -- só se is_fixed=true
  flexible_period TEXT CHECK (flexible_period IN ('morning', 'afternoon', 'evening', 'anytime')),
  estimated_duration INTEGER DEFAULT 15, -- minutos
  reminder_minutes INTEGER DEFAULT 10,
  transition_warning BOOLEAN DEFAULT true,
  subtasks JSONB, -- array de {id, text, order}
  note TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.4. Tabela: task_logs

```sql
CREATE TABLE task_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES routines(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  task_name TEXT NOT NULL, -- snapshot do nome
  status TEXT NOT NULL CHECK (status IN ('pending', 'done', 'skipped', 'postponed')),
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES users(id), -- quem marcou (pode ser parceiro)
  assumed_by UUID REFERENCES users(id), -- se parceiro assumiu
  subtasks_completed JSONB, -- IDs das subtarefas completadas
  is_difficult_day BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.5. Tabela: daily_status

```sql
CREATE TABLE daily_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  energy_level TEXT CHECK (energy_level IN ('high', 'medium', 'low')),
  mood TEXT CHECK (mood IN ('good', 'meh', 'difficult')),
  is_paused BOOLEAN DEFAULT false,
  pause_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

### 4.6. Tabela: suggestions

```sql
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);
```

### 4.7. Tabela: feedbacks

```sql
CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL, -- 'great_job', 'you_can_do_it', 'need_help', 'making_coffee', 'im_here'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.8. Tabela: pause_periods

```sql
CREATE TABLE pause_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.9. Tabela: streaks

```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### 4.10. Row Level Security (RLS)

```sql
-- Users só veem seus dados e do parceiro
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON users
  FOR ALL USING (
    auth.uid() = id OR 
    id = (SELECT partner_id FROM users WHERE id = auth.uid())
  );

-- Aplicar RLS similar para todas as tabelas
-- Routines, task_logs, daily_status: próprio usuário + parceiro pode ver
-- Suggestions, feedbacks: envolvidos podem ver
```

---

## 5. Stack Técnica

### 5.1. Frontend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 15.x | Framework React |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 3.x | Estilização |
| shadcn/ui | latest | Componentes |
| Zustand | 4.x | Estado Global |
| Lucide React | latest | Ícones |
| date-fns | latest | Manipulação de datas |

### 5.2. Backend
| Tecnologia | Uso |
|------------|-----|
| Supabase | Auth + Database + Realtime |
| PostgreSQL | Banco de dados |
| Edge Functions | Lógica serverless (se necessário) |

### 5.3. PWA
| Tecnologia | Uso |
|------------|-----|
| next-pwa | Service Worker |
| Web Push API | Notificações |
| Workbox | Cache strategies |

### 5.4. Deploy
| Serviço | Uso |
|---------|-----|
| Vercel | Hosting + CI/CD |
| Supabase | Backend |

---

## 6. Estrutura de Pastas

```
rotina-a-dois/
├── public/
│   ├── icons/              # Ícones PWA
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service Worker
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── pairing/
│   │   ├── (main)/
│   │   │   ├── page.tsx           # Dashboard (Meu Dia)
│   │   │   ├── week/
│   │   │   ├── month/
│   │   │   ├── partner/
│   │   │   ├── routines/
│   │   │   ├── suggestions/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Header.tsx
│   │   │   └── PageContainer.tsx
│   │   ├── dashboard/
│   │   │   ├── DayProgress.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── FocusMode.tsx
│   │   │   ├── EnergyMoodPicker.tsx
│   │   │   └── PartnerCard.tsx
│   │   ├── calendar/
│   │   │   ├── WeekView.tsx
│   │   │   ├── MonthView.tsx
│   │   │   └── DayCell.tsx
│   │   ├── routines/
│   │   │   ├── RoutineEditor.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── SubtaskList.tsx
│   │   │   └── TemplateGallery.tsx
│   │   ├── partner/
│   │   │   ├── PartnerDashboard.tsx
│   │   │   ├── FeedbackButtons.tsx
│   │   │   └── SuggestionForm.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       └── ConfirmDialog.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useRoutines.ts
│   │   ├── useTaskLogs.ts
│   │   ├── usePartner.ts
│   │   ├── useSuggestions.ts
│   │   ├── useNotifications.ts
│   │   └── useTheme.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── routineStore.ts
│   │   └── uiStore.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── templates.ts        # Templates de tarefas
│   └── types/
│       └── index.ts
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 7. Fluxos de Usuário

### 7.1. Primeiro Acesso

```
1. Abre o app
2. Tela de boas-vindas
3. Login com email (magic link) ou Google
4. Recebe código de pareamento
5. Compartilha código com parceiro (WhatsApp)
6. Parceiro insere código
7. Pareados! ✓
8. Escolhe tema (Oceano ou Midnight)
9. Tutorial rápido (opcional)
10. Dashboard vazio → CTA criar primeira rotina
```

### 7.2. Dia Normal

```
1. Abre o app
2. Modal de energia/humor (se primeira vez no dia)
3. Vê dashboard com tarefas do dia
4. Recebe notificação de tarefa
5. Marca como feita
6. Repete até fim do dia
7. Vê progresso final
8. (Opcional) Vê como parceiro está indo
```

### 7.3. Dia Difícil

```
1. Abre o app
2. Seleciona energia "Baixa" e humor "Difícil"
3. Clica em "Dia Difícil"
4. Rotina muda para versão mínima
5. Tarefas reduzidas ao essencial
6. Mensagem de acolhimento
7. Parceiro vê status e pode enviar apoio
```

### 7.4. Criar Rotina

```
1. Vai em "Editar Rotinas"
2. Seleciona dia da semana
3. Clica em "+"
4. Escolhe template ou cria do zero
5. Define horário, duração, lembrete
6. Adiciona subtarefas (opcional)
7. Salva
8. Opção de clonar para outros dias
```

---

## 8. Mensagens e Tom de Voz

### 8.1. Princípios
- Sempre gentil e acolhedor
- Nunca culpabilizante
- Celebra pequenas vitórias
- Normaliza dias difíceis
- Usa emojis com moderação

### 8.2. Exemplos

**Boas-vindas:**
> "Bom dia, [Nome]! ☀️ Vamos juntos hoje?"

**Tarefa completada:**
> "Boa! ✓"

**Progresso:**
> "Você já fez 60% do dia. Tá indo bem!"

**Dia difícil:**
> "Tudo bem ir devagar hoje. O importante é cuidar de você. 💙"

**Streak:**
> "🔥 5 dias seguidos! Vocês são incríveis!"

**Lembrete gentil:**
> "Ei, [tarefa] tá pendente. Tudo bem por aí?"

**Parceiro enviou apoio:**
> "[Nome] mandou: Você consegue! 💪"

---

## 9. Métricas de Sucesso

### 9.1. Engajamento
- Usuários ativos diários
- Taxa de conclusão de tarefas
- Streak médio

### 9.2. Satisfação
- Uso contínuo (retenção)
- Feedbacks enviados entre parceiros
- Sugestões aceitas

### 9.3. Técnicas
- Tempo de carregamento < 2s
- PWA instalado
- Notificações habilitadas

---

## 10. Fora do Escopo (V1)

- ❌ Múltiplos parceiros/família
- ❌ Integração com calendários externos
- ❌ Chat/mensagens no app
- ❌ Gamificação elaborada (níveis, badges)
- ❌ Versão desktop dedicada
- ❌ App nativo (iOS/Android)
- ❌ Sincronização com assistentes de voz
- ❌ Modo offline completo (só cache básico)

---

## 11. Roadmap Futuro (pós V1)

### V1.1
- Sincronização com Google Calendar
- Mais templates de tarefas
- Widgets para tela inicial

### V1.2
- Modo família (mais pessoas)
- Relatórios semanais por email
- Backup automático

### V2.0
- App nativo
- Integração com Alexa/Google Home
- IA para sugerir otimizações na rotina

---

## 12. Conclusão

O **Rotina a Dois** é um app focado em ajudar casais neurodivergentes a construírem e manterem rotinas de forma gentil e colaborativa. A V1 foca no essencial: criar rotinas, receber lembretes, acompanhar o parceiro e ter flexibilidade para dias difíceis.

O design é mobile-first, com dois temas personalizados, e a tecnologia é moderna mas acessível para desenvolvimento rápido.

---

*Documento aprovado para desenvolvimento.*
*Próximo passo: criar arquivos AGENTRULES, IMPLEMENTACAO e COMANDOS.*
