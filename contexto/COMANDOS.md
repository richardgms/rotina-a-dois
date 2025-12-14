# COMANDOS PARA O ANTIGRAVITY - ROTINA A DOIS

## Instruções de Uso
1. Copie e cole cada comando, **um por vez**
2. Espere a IA terminar completamente
3. Teste conforme indicado (✅ Teste)
4. Só avance se o teste passar
5. Ações com ⚠️ são manuais (você faz, não a IA)

---

## COMANDO 0: LEITURA INICIAL

```
Leia completamente os arquivos PRD.md, .agentrules, IMPLEMENTACAO.md e TEMPLATES.md antes de fazer qualquer coisa.

Depois de ler, me confirme que entendeu:
1. O que é o projeto (Rotina a Dois - app de rotina para casais neurodivergentes)
2. A stack (Next.js 15, Supabase, Tailwind, shadcn/ui, Zustand, PWA)
3. A estrutura de pastas esperada
4. As regras de código do .agentrules
5. Que vamos usar TEMPLATES prontos sempre que possível
6. Os dois temas: Oceano (claro) e Midnight (escuro)

Não crie nenhum arquivo ainda. Apenas confirme o entendimento.
```

---

## FASE 1: SETUP DO PROJETO

### Comando 1.1: Criar Projeto

```
Crie o projeto Next.js com o seguinte comando e configurações:

npx create-next-app@latest rotina-a-dois

Configurações:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- src/ directory: Yes
- App Router: Yes
- Import alias: @/*

Após criar, entre na pasta do projeto.
```

**✅ Teste:** Rode `npm run dev` e acesse http://localhost:3000

---

### Comando 1.2: Instalar Dependências

```
Instale todas as dependências necessárias do projeto:

# shadcn/ui (responda as perguntas padrão)
npx shadcn@latest init

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Estado global
npm install zustand immer

# Utilitários
npm install date-fns lucide-react

# PWA
npm install next-pwa

# Toast
npm install sonner

Confirme que todas foram instaladas sem erros.
```

**✅ Teste:** Rode `npm run dev` - não deve ter erros

---

### Comando 1.3: Instalar Componentes shadcn/ui

```
Instale os componentes shadcn/ui que vamos usar:

npx shadcn@latest add button card checkbox dialog dropdown-menu input label progress select sheet skeleton switch tabs avatar alert-dialog

Confirme que todos foram instalados em src/components/ui/
```

**✅ Teste:** Verifique se a pasta `src/components/ui/` tem os arquivos

---

### Comando 1.4: Criar Estrutura de Pastas

```
Crie a estrutura completa de pastas do projeto conforme o PRD:

src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx (placeholder)
│   │   └── pairing/
│   │       └── page.tsx (placeholder)
│   ├── (main)/
│   │   ├── layout.tsx (placeholder)
│   │   ├── page.tsx (placeholder)
│   │   ├── week/
│   │   │   └── page.tsx (placeholder)
│   │   ├── month/
│   │   │   └── page.tsx (placeholder)
│   │   ├── partner/
│   │   │   └── page.tsx (placeholder)
│   │   ├── routines/
│   │   │   └── page.tsx (placeholder)
│   │   ├── suggestions/
│   │   │   └── page.tsx (placeholder)
│   │   └── settings/
│   │       └── page.tsx (placeholder)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts (placeholder)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (já existe do shadcn)
│   ├── layout/
│   ├── dashboard/
│   ├── calendar/
│   ├── routines/
│   ├── partner/
│   └── common/
├── hooks/
├── stores/
├── lib/
│   └── supabase/
└── types/

Crie arquivos placeholder (export default function Page() { return <div>TODO</div> }) em cada page.tsx.
```

**✅ Teste:** `npm run build` deve passar sem erros

---

### Comando 1.5: Configurar Arquivo de Tipos

```
Crie o arquivo src/types/index.ts com todos os tipos do projeto.

Use EXATAMENTE o código da seção "1.1. Tipos" do arquivo TEMPLATES.md.

Isso inclui:
- Interfaces: User, TaskTemplate, Routine, Subtask, TaskLog, DailyStatus, Suggestion, Feedback, PausePeriod, Streak
- Types: TaskCategory, FlexiblePeriod, TaskStatus, EnergyLevel, Mood, SuggestionStatus, FeedbackType
- Tipos de UI: DayInfo, WeekInfo
- Constantes: DAYS_OF_WEEK, CATEGORY_LABELS, PERIOD_LABELS, ENERGY_LABELS, MOOD_LABELS, FEEDBACK_MESSAGES, DURATION_OPTIONS, REMINDER_OPTIONS
```

**✅ Teste:** Nenhum erro de TypeScript no arquivo

---

### Comando 1.6: Configurar CSS Global com Temas

```
Substitua o conteúdo de src/app/globals.css pelo CSS completo da seção "1.6. CSS Global" do TEMPLATES.md.

Isso inclui:
- Tema Oceano (padrão) em :root
- Tema Midnight em [data-theme="midnight"]
- Variáveis CSS para todas as cores
- Classes utilitárias (scrollbar-hide, safe-bottom, safe-top)
- Suporte a fonte grande [data-font-size="large"]
```

**✅ Teste:** Rode o app e veja se os estilos básicos funcionam

---

### Comando 1.7: Criar Arquivo de Utilitários

```
Crie o arquivo src/lib/utils.ts com todas as funções utilitárias.

Use o código da seção "1.5. Utilitários" do TEMPLATES.md.

Funções incluídas:
- cn() - merge de classes Tailwind
- formatDate(), formatTime(), formatDateExtended()
- checkIsToday(), checkIsPast(), checkIsFuture()
- getWeekDays()
- generatePairingCode()
- calculateCompletionPercentage()
- getGreeting()
- getCompletionColor(), getCompletionBgColor()
- debounce()
```

**✅ Teste:** Nenhum erro de TypeScript

---

### Comando 1.8: Criar Arquivo .env.local

```
Crie o arquivo .env.local na raiz do projeto com:

NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_aqui

Por enquanto deixe os valores como placeholder. Vamos preencher depois de configurar o Supabase.

Também adicione .env.local ao .gitignore se não estiver lá.
```

**✅ Teste:** Arquivo criado

---

## ⚠️ AÇÃO MANUAL: Criar Projeto no Supabase

1. Acesse https://supabase.com e faça login
2. Clique em "New Project"
3. Nome: `rotina-a-dois`
4. Escolha uma senha forte para o banco
5. Região: escolha a mais próxima (South America se disponível)
6. Aguarde o projeto ser criado (~2 minutos)
7. Vá em Project Settings > API
8. Copie a "Project URL" e "anon public" key
9. Cole no seu arquivo .env.local

**✅ Teste:** As variáveis no .env.local estão preenchidas

---

## FASE 2: SUPABASE SETUP

### ⚠️ AÇÃO MANUAL: Criar Tabelas no Supabase

Acesse o SQL Editor no Supabase e execute os SQLs abaixo **um por vez**:

**SQL 1 - Tabela users:**
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
  first_day_of_week INTEGER DEFAULT 0,
  notifications_enabled BOOLEAN DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**SQL 2 - Tabela task_templates:**
```sql
CREATE TABLE task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  default_duration INTEGER DEFAULT 15,
  suggested_subtasks JSONB,
  is_system BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**SQL 3 - Tabela routines:**
```sql
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  task_name TEXT NOT NULL,
  task_icon TEXT DEFAULT '📌',
  category TEXT,
  is_fixed BOOLEAN DEFAULT false,
  scheduled_time TIME,
  flexible_period TEXT CHECK (flexible_period IN ('morning', 'afternoon', 'evening', 'anytime')),
  estimated_duration INTEGER DEFAULT 15,
  reminder_minutes INTEGER DEFAULT 10,
  transition_warning BOOLEAN DEFAULT true,
  subtasks JSONB,
  note TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**SQL 4 - Tabela task_logs:**
```sql
CREATE TABLE task_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES routines(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  task_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'done', 'skipped', 'postponed')),
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES users(id),
  assumed_by UUID REFERENCES users(id),
  subtasks_completed JSONB,
  is_difficult_day BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**SQL 5 - Tabela daily_status:**
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

**SQL 6 - Tabela suggestions:**
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

**SQL 7 - Tabela feedbacks:**
```sql
CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**SQL 8 - Tabela pause_periods:**
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

**SQL 9 - Tabela streaks:**
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

**✅ Teste:** Vá em Table Editor no Supabase e veja se as 9 tabelas existem

---

### ⚠️ AÇÃO MANUAL: Configurar RLS (Row Level Security)

Execute este SQL no Supabase para configurar segurança:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pause_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Policy para users
CREATE POLICY "Users can view own and partner data" ON users
  FOR SELECT USING (
    auth.uid() = id OR 
    id = (SELECT partner_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy para task_templates
CREATE POLICY "Anyone can view system templates" ON task_templates
  FOR SELECT USING (is_system = true);

CREATE POLICY "Users can manage own templates" ON task_templates
  FOR ALL USING (auth.uid() = created_by);

-- Policy para routines
CREATE POLICY "Users can manage own routines" ON routines
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view partner routines" ON routines
  FOR SELECT USING (
    user_id = (SELECT partner_id FROM users WHERE id = auth.uid())
  );

-- Policy para task_logs
CREATE POLICY "Users can manage own task logs" ON task_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view partner task logs" ON task_logs
  FOR SELECT USING (
    user_id = (SELECT partner_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Partner can update task logs" ON task_logs
  FOR UPDATE USING (
    user_id = (SELECT partner_id FROM users WHERE id = auth.uid())
  );

-- Policy para daily_status
CREATE POLICY "Users can manage own daily status" ON daily_status
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view partner daily status" ON daily_status
  FOR SELECT USING (
    user_id = (SELECT partner_id FROM users WHERE id = auth.uid())
  );

-- Policy para suggestions
CREATE POLICY "Users can view own suggestions" ON suggestions
  FOR SELECT USING (
    auth.uid() = from_user_id OR auth.uid() = to_user_id
  );

CREATE POLICY "Users can insert suggestions" ON suggestions
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update received suggestions" ON suggestions
  FOR UPDATE USING (auth.uid() = to_user_id);

-- Policy para feedbacks
CREATE POLICY "Users can view own feedbacks" ON feedbacks
  FOR SELECT USING (
    auth.uid() = from_user_id OR auth.uid() = to_user_id
  );

CREATE POLICY "Users can insert feedbacks" ON feedbacks
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- Policy para pause_periods
CREATE POLICY "Users can manage own pause periods" ON pause_periods
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view partner pause periods" ON pause_periods
  FOR SELECT USING (
    user_id = (SELECT partner_id FROM users WHERE id = auth.uid())
  );

-- Policy para streaks
CREATE POLICY "Users can manage own streaks" ON streaks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view partner streaks" ON streaks
  FOR SELECT USING (
    user_id = (SELECT partner_id FROM users WHERE id = auth.uid())
  );
```

**✅ Teste:** Não deve dar erro. RLS ativo nas tabelas.

---

### ⚠️ AÇÃO MANUAL: Inserir Templates de Tarefas

Execute este SQL para inserir os templates de tarefas domésticas:

```sql
INSERT INTO task_templates (name, icon, category, default_duration, suggested_subtasks, is_system) VALUES
-- Manhã
('Acordar', '☀️', 'morning', 5, NULL, true),
('Tomar água', '💧', 'morning', 2, NULL, true),
('Tomar remédios', '💊', 'morning', 5, NULL, true),
('Café da manhã', '🍳', 'morning', 20, '["Preparar", "Comer", "Limpar"]', true),
('Arrumar a cama', '🛏️', 'morning', 5, NULL, true),
('Se arrumar', '👔', 'morning', 30, '["Banho", "Vestir", "Cabelo"]', true),
('Escovar dentes', '🪥', 'morning', 5, NULL, true),
('Skincare manhã', '🧴', 'morning', 10, NULL, true),

-- Limpeza
('Lavar louça', '🍽️', 'cleaning', 20, NULL, true),
('Varrer casa', '🧹', 'cleaning', 20, NULL, true),
('Passar pano', '🧽', 'cleaning', 30, NULL, true),
('Limpar banheiro', '🚽', 'cleaning', 30, '["Vaso", "Pia", "Box", "Chão"]', true),
('Tirar lixo', '🗑️', 'cleaning', 10, NULL, true),
('Organizar sala', '🛋️', 'cleaning', 15, NULL, true),
('Lavar roupa', '🧺', 'cleaning', 15, '["Separar", "Colocar na máquina", "Ligar"]', true),
('Estender roupa', '👕', 'cleaning', 15, NULL, true),
('Recolher/dobrar roupa', '👚', 'cleaning', 20, NULL, true),

-- Cozinha
('Preparar almoço', '🥗', 'kitchen', 45, '["Separar ingredientes", "Cozinhar", "Servir"]', true),
('Preparar janta', '🍝', 'kitchen', 45, '["Separar ingredientes", "Cozinhar", "Servir"]', true),
('Limpar fogão', '🔥', 'kitchen', 15, NULL, true),
('Organizar geladeira', '❄️', 'kitchen', 20, NULL, true),
('Lista de compras', '🛒', 'kitchen', 15, NULL, true),

-- Noite
('Preparar roupa do dia seguinte', '👔', 'evening', 10, NULL, true),
('Skincare noite', '🧴', 'evening', 10, NULL, true),
('Remédios da noite', '💊', 'evening', 5, NULL, true),
('Desligar eletrônicos', '📱', 'evening', 5, NULL, true),
('Hora de dormir', '🌙', 'evening', 10, NULL, true),

-- Autocuidado
('Banho', '🚿', 'selfcare', 20, NULL, true),
('Beber água', '💧', 'selfcare', 2, NULL, true),
('Exercício físico', '🏃', 'selfcare', 45, '["Aquecimento", "Exercício", "Alongamento"]', true),
('Momento de descanso', '🧘', 'selfcare', 30, NULL, true),
('Ler', '📖', 'selfcare', 30, NULL, true),
('Lazer', '🎮', 'selfcare', 60, NULL, true),

-- Trabalho/Estudo
('Início do trabalho', '💼', 'work', 5, NULL, true),
('Pausa', '☕', 'work', 15, NULL, true),
('Estudar', '📚', 'work', 60, '["Revisar material", "Fazer exercícios", "Anotar dúvidas"]', true),
('Checar emails', '📧', 'work', 15, NULL, true);
```

**✅ Teste:** Vá em Table Editor > task_templates e veja se tem 34 registros

---

### ⚠️ AÇÃO MANUAL: Configurar Auth no Supabase

1. No Supabase, vá em **Authentication** > **Providers**
2. Certifique-se que **Email** está habilitado
3. Em **Email** > **Enable Email OTP** deve estar ON (Magic Link)
4. Vá em **Authentication** > **URL Configuration**
5. Adicione em **Redirect URLs**:
   - `http://localhost:3000/auth/callback`

**✅ Teste:** Configurações salvas

---

### Comando 2.1: Criar Cliente Supabase (Browser)

```
Crie o arquivo src/lib/supabase/client.ts

Use EXATAMENTE o código da seção "1.2. Cliente Supabase" do TEMPLATES.md.

Este é o cliente para uso em componentes do lado do cliente ('use client').
```

**✅ Teste:** Arquivo criado sem erros de TypeScript

---

### Comando 2.2: Criar Cliente Supabase (Server)

```
Crie o arquivo src/lib/supabase/server.ts

Use EXATAMENTE o código da seção "1.3. Servidor Supabase" do TEMPLATES.md.

Este é o cliente para uso em Server Components e Route Handlers.
```

**✅ Teste:** Arquivo criado sem erros de TypeScript

---

### Comando 2.3: Criar Middleware

```
Crie o arquivo src/middleware.ts na raiz de src/

Use EXATAMENTE o código da seção "1.4. Middleware" do TEMPLATES.md.

Este middleware:
- Renova a sessão do usuário
- Protege rotas que precisam de autenticação
- Redireciona não autenticados para /login
- Redireciona não pareados para /pairing
```

**✅ Teste:** `npm run build` passa sem erros

---

## FASE 3: STORES E HOOKS

### Comando 3.1: Criar Auth Store

```
Crie o arquivo src/stores/authStore.ts

Use EXATAMENTE o código da seção "2.1. Auth Store" do TEMPLATES.md.

Esta store gerencia:
- user: usuário atual
- partner: parceiro vinculado
- isLoading, isAuthenticated
- Actions: setUser, setPartner, logout
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 3.2: Criar Routine Store

```
Crie o arquivo src/stores/routineStore.ts

Use EXATAMENTE o código da seção "2.2. Routine Store" do TEMPLATES.md.

Esta store gerencia:
- routines, todayTasks, dailyStatus
- selectedDay, selectedDate
- isFocusMode
- Actions para CRUD de rotinas e tarefas
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 3.3: Criar UI Store

```
Crie o arquivo src/stores/uiStore.ts

Use EXATAMENTE o código da seção "2.3. UI Store" do TEMPLATES.md.

Esta store gerencia:
- Modais abertos/fechados
- Dialog de confirmação
- ID da rotina sendo editada
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 3.4: Criar Hook useAuth

```
Crie o arquivo src/hooks/useAuth.ts

Use EXATAMENTE o código da seção "3.1. useAuth" do TEMPLATES.md.

Este hook fornece:
- user, partner, isLoading, isAuthenticated
- signInWithEmail, signInWithGoogle, signOut
- pairWithPartner
- refetchUser
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 3.5: Criar Hook useRoutines

```
Crie o arquivo src/hooks/useRoutines.ts

Use EXATAMENTE o código da seção "3.2. useRoutines" do TEMPLATES.md.

Este hook fornece:
- routines, routinesForDay, isLoading
- fetchRoutines, createRoutine, editRoutine, removeRoutine
- cloneRoutineToDay, reorderRoutines
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 3.6: Criar Hook useTaskLogs

```
Crie o arquivo src/hooks/useTaskLogs.ts

Use EXATAMENTE o código da seção "3.3. useTaskLogs" do TEMPLATES.md.

Este hook fornece:
- todayTasks, progress, nextTask
- fetchTaskLogs, initializeDayTasks, setTaskStatus, toggleSubtask
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 3.7: Criar Hook useTheme

```
Crie o arquivo src/hooks/useTheme.ts

Use EXATAMENTE o código da seção "3.4. useTheme" do TEMPLATES.md.

Este hook fornece:
- theme, fontSize
- setTheme, setFontSize
- isOcean, isMidnight
```

**✅ Teste:** Sem erros de TypeScript

---

## FASE 4: COMPONENTES DE LAYOUT

### Comando 4.1: Criar Header (EXECUTEI ESSE COMANDO E PAREI AQUI)

```
Crie o arquivo src/components/layout/Header.tsx

Use EXATAMENTE o código da seção "4.1. Header" do TEMPLATES.md.

O header mostra:
- Saudação personalizada (Bom dia, Nome!)
- Streak atual (🔥 X)
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 4.2: Criar BottomNav

```
Crie o arquivo src/components/layout/BottomNav.tsx

Use EXATAMENTE o código da seção "4.2. BottomNav" do TEMPLATES.md.

A navegação tem 5 itens:
- Hoje (Home)
- Semana (Calendar)
- Mês (CalendarDays)
- Parceiro (Heart)
- Config (Settings)
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 4.3: Criar PageContainer

```
Crie o arquivo src/components/layout/PageContainer.tsx

Use EXATAMENTE o código da seção "4.3. PageContainer" do TEMPLATES.md.

Container com padding consistente para todas as páginas.
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 4.4: Criar Layout Principal

```
Atualize o arquivo src/app/(main)/layout.tsx

Use EXATAMENTE o código da seção "4.4. Layout Principal" do TEMPLATES.md.

O layout inclui:
- Header no topo
- Área de conteúdo
- BottomNav fixo no bottom
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 4.5: Configurar Toaster

```
Atualize o arquivo src/app/layout.tsx principal para incluir o Toaster do Sonner:

import { Toaster } from 'sonner';

E adicione <Toaster position="top-center" /> dentro do body, após o {children}.

Isso permite mostrar notificações de sucesso/erro em todo o app.
```

**✅ Teste:** `npm run dev` funciona

---

## FASE 5: COMPONENTES DO DASHBOARD

### Comando 5.1: Criar LoadingSpinner

```
Crie o arquivo src/components/common/LoadingSpinner.tsx

Use EXATAMENTE o código da seção "6.1. LoadingSpinner" do TEMPLATES.md.

Inclui LoadingSpinner e LoadingPage.
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 5.2: Criar EmptyState

```
Crie o arquivo src/components/common/EmptyState.tsx

Use EXATAMENTE o código da seção "6.2. EmptyState" do TEMPLATES.md.

Componente para estados vazios com ícone, título, descrição e ação opcional.
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 5.3: Criar ConfirmDialog

```
Crie o arquivo src/components/common/ConfirmDialog.tsx

Use EXATAMENTE o código da seção "6.3. ConfirmDialog" do TEMPLATES.md.

Dialog de confirmação reutilizável conectado à UI Store.
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 5.4: Criar DayProgress

```
Crie o arquivo src/components/dashboard/DayProgress.tsx

Use EXATAMENTE o código da seção "5.1. DayProgress" do TEMPLATES.md.

Mostra:
- Barra de progresso
- Porcentagem
- Tarefas completadas/total
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 5.5: Criar TaskItem

```
Crie o arquivo src/components/dashboard/TaskItem.tsx

Use EXATAMENTE o código da seção "5.2. TaskItem" do TEMPLATES.md.

Este é o componente mais complexo do dashboard, com:
- Checkbox para marcar
- Ícone e nome da tarefa
- Horário ou "Flexível"
- Tempo estimado
- Expansão para subtarefas e nota
- Ações: Pular, Adiar
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 5.6: Criar FocusMode

```
Crie o arquivo src/components/dashboard/FocusMode.tsx

Use EXATAMENTE o código da seção "5.3. FocusMode" do TEMPLATES.md.

Modo foco que mostra apenas a próxima tarefa.
- Botão "O que fazer agora?"
- Card com tarefa em destaque
- Botão "Ver tudo" para voltar
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 5.7: Criar EnergyMoodPicker

```
Crie o arquivo src/components/dashboard/EnergyMoodPicker.tsx

Use EXATAMENTE o código da seção "5.4. EnergyMoodPicker" do TEMPLATES.md.

Modal para selecionar:
- Energia: Alta, Média, Baixa
- Humor: Bem, Meh, Difícil
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 5.8: Criar PartnerCard

```
Crie o arquivo src/components/dashboard/PartnerCard.tsx

Use EXATAMENTE o código da seção "5.5. PartnerCard" do TEMPLATES.md.

Mini card que mostra:
- Avatar e nome do parceiro
- Energia/humor dele
- Progresso do dia
- Link para página do parceiro
```

**✅ Teste:** Sem erros de TypeScript

---

## FASE 6: AUTENTICAÇÃO

### Comando 6.1: Criar Página de Login

```
Atualize o arquivo src/app/(auth)/login/page.tsx

Use EXATAMENTE o código da seção "7.1. Login" do TEMPLATES.md.

A página de login tem:
- Logo e nome do app
- Input de email
- Botão de enviar magic link
- Botão de login com Google
- Estado de "link enviado"
```

**✅ Teste:** `npm run dev` e acesse /login - deve renderizar

---

### Comando 6.2: Criar Auth Callback

```
Atualize o arquivo src/app/auth/callback/route.ts para processar o callback do magic link:

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && user) {
      // Verificar se usuário existe na tabela users
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      // Se não existe, criar
      if (!existingUser) {
        const pairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        await supabase.from('users').insert({
          id: user.id,
          email: user.email!,
          name: user.email!.split('@')[0],
          pairing_code: pairingCode,
        });
        
        // Redirecionar para pareamento
        return NextResponse.redirect(new URL('/pairing', requestUrl.origin));
      }

      // Verificar se tem parceiro
      const { data: userData } = await supabase
        .from('users')
        .select('partner_id')
        .eq('id', user.id)
        .single();

      if (!userData?.partner_id) {
        return NextResponse.redirect(new URL('/pairing', requestUrl.origin));
      }
    }
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 6.3: Criar Página de Pareamento

```
Atualize o arquivo src/app/(auth)/pairing/page.tsx para a tela de pareamento:

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';

export default function PairingPage() {
  const [partnerCode, setPartnerCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { pairWithPartner } = useAuth();
  const supabase = getSupabaseClient();

  useEffect(() => {
    async function fetchMyCode() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('pairing_code')
          .eq('id', user.id)
          .single();
        
        if (data?.pairing_code) {
          setMyCode(data.pairing_code);
        }
      }
    }
    fetchMyCode();
  }, [supabase]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(myCode);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerCode.trim()) return;

    setIsLoading(true);
    try {
      await pairWithPartner(partnerCode.trim().toUpperCase());
      toast.success('Pareado com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao parear');
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
            Compartilhe seu código ou insira o código do seu amor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meu código */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-center">Seu código:</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-2xl font-mono font-bold tracking-widest bg-muted px-4 py-2 rounded-lg">
                {myCode || '------'}
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

          {/* Inserir código do parceiro */}
          <form onSubmit={handlePair} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-center">Código do parceiro(a):</p>
              <Input
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                className="text-center text-lg font-mono tracking-widest"
                maxLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || partnerCode.length < 6}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Conectando...
                </>
              ) : (
                'Conectar 💕'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

**✅ Teste:** Acesse /pairing - deve mostrar seu código e input para código do parceiro

---

### Comando 6.4: Criar Layout de Auth

```
Crie o arquivo src/app/(auth)/layout.tsx para as páginas de autenticação:

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
```

**✅ Teste:** Login e pairing devem funcionar sem o BottomNav

---

## FASE 7: PÁGINA DASHBOARD

### Comando 7.1: Implementar Dashboard Completo

```
Atualize o arquivo src/app/(main)/page.tsx

Use EXATAMENTE o código da seção "7.2. Dashboard" do TEMPLATES.md.

O dashboard inclui:
- Navegação entre dias (← hoje →)
- Status de energia/humor
- Barra de progresso
- Botão "Dia difícil"
- Modo foco ou lista de tarefas
- Card do parceiro
- Modal de energia/humor
```

**✅ Teste:** `npm run dev` e faça login - dashboard deve carregar

---

### Comando 7.2: Criar Hook useDailyStatus

```
Crie o arquivo src/hooks/useDailyStatus.ts para gerenciar o status diário:

'use client';

import { useCallback } from 'react';
import { format } from 'date-fns';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRoutineStore } from '@/stores/routineStore';
import { useAuthStore } from '@/stores/authStore';
import type { DailyStatus, EnergyLevel, Mood } from '@/types';

export function useDailyStatus() {
  const supabase = getSupabaseClient();
  const { user } = useAuthStore();
  const { dailyStatus, selectedDate, setDailyStatus } = useRoutineStore();

  const fetchDailyStatus = useCallback(async (date?: Date) => {
    if (!user) return;

    const targetDate = date || selectedDate;
    const dateStr = format(targetDate, 'yyyy-MM-dd');

    try {
      const { data, error } = await supabase
        .from('daily_status')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', dateStr)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setDailyStatus(data as DailyStatus | null);
    } catch (error) {
      console.error('Erro ao buscar daily status:', error);
    }
  }, [user, selectedDate, supabase, setDailyStatus]);

  const saveDailyStatus = async (energy: EnergyLevel, mood: Mood) => {
    if (!user) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    try {
      const { data, error } = await supabase
        .from('daily_status')
        .upsert({
          user_id: user.id,
          date: dateStr,
          energy_level: energy,
          mood: mood,
        })
        .select()
        .single();

      if (error) throw error;
      setDailyStatus(data as DailyStatus);
    } catch (error) {
      console.error('Erro ao salvar daily status:', error);
      throw error;
    }
  };

  const activateDifficultDay = async () => {
    if (!user) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    try {
      const { data, error } = await supabase
        .from('daily_status')
        .upsert({
          user_id: user.id,
          date: dateStr,
          energy_level: 'low',
          mood: 'difficult',
        })
        .select()
        .single();

      if (error) throw error;
      setDailyStatus(data as DailyStatus);
    } catch (error) {
      console.error('Erro ao ativar dia difícil:', error);
      throw error;
    }
  };

  return {
    dailyStatus,
    fetchDailyStatus,
    saveDailyStatus,
    activateDifficultDay,
  };
}
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 7.3: Atualizar Dashboard para usar useDailyStatus

```
Atualize o Dashboard (src/app/(main)/page.tsx) para:

1. Importar useDailyStatus
2. Usar saveDailyStatus no EnergyMoodPicker
3. Usar activateDifficultDay no botão "Dia difícil"

Adicione as importações e integre as funções nos handlers corretos.
```

**✅ Teste:** Login, selecionar energia/humor, ver se salva no banco

---

## FASE 8: EDITOR DE ROTINAS

### Comando 8.1: Criar Componente TemplateGallery

```
Crie o arquivo src/components/routines/TemplateGallery.tsx:

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

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)] as const;

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

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {cat === 'all' ? 'Todos' : CATEGORY_LABELS[cat as TaskCategory]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {filtered.map((template) => (
          <Card
            key={template.id}
            className="p-3 cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onSelect(template)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{template.icon}</span>
              <span className="text-sm font-medium truncate">{template.name}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 8.2: Criar Componente TaskForm

```
Crie o arquivo src/components/routines/TaskForm.tsx com o formulário completo para criar/editar tarefas.

O formulário deve ter:
- Input de nome (ou selecionar template)
- Seletor de ícone (galeria de emojis comuns)
- Select de categoria
- Toggle fixa/flexível
- TimePicker se fixa, Select de período se flexível
- Select de duração estimada
- Select de lembrete
- Toggle de aviso de transição
- Seção de subtarefas (adicionar/remover)
- Textarea de nota

Deve receber props: onSave, onCancel, initialData (para edição).

Use os componentes shadcn/ui: Dialog, Input, Select, Switch, Button, Textarea.
Use as constantes DURATION_OPTIONS e REMINDER_OPTIONS do types/index.ts.
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 8.3: Criar Página de Rotinas

```
Atualize o arquivo src/app/(main)/routines/page.tsx para o editor de rotinas:

'use client';

import { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useRoutines } from '@/hooks/useRoutines';
import { useRoutineStore } from '@/stores/routineStore';
import { useUIStore } from '@/stores/uiStore';
import { DAYS_OF_WEEK_SHORT } from '@/types';
import { cn, formatTime } from '@/lib/utils';

export default function RoutinesPage() {
  const { routines, routinesForDay, isLoading, fetchRoutines, removeRoutine } = useRoutines();
  const { selectedDay, setSelectedDay } = useRoutineStore();
  const { openTaskForm, openConfirmDialog } = useUIStore();

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const handleDelete = (id: string, name: string) => {
    openConfirmDialog({
      title: 'Remover tarefa?',
      description: `"${name}" será removida da sua rotina.`,
      onConfirm: () => removeRoutine(id),
    });
  };

  if (isLoading) return <LoadingPage />;

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-4">Editar Rotinas</h1>

      {/* Seletor de dia */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {DAYS_OF_WEEK_SHORT.map((day, index) => (
          <button
            key={day}
            onClick={() => setSelectedDay(index)}
            className={cn(
              'flex-1 min-w-[44px] py-2 rounded-lg text-sm font-medium transition-colors',
              selectedDay === index
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Lista de tarefas do dia */}
      {routinesForDay.length === 0 ? (
        <EmptyState
          icon="📝"
          title="Nenhuma tarefa neste dia"
          description="Adicione tarefas para criar sua rotina"
          action={{
            label: 'Adicionar tarefa',
            onClick: () => openTaskForm(),
          }}
        />
      ) : (
        <div className="space-y-2 mb-4">
          {routinesForDay
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((routine) => (
              <Card key={routine.id} className="p-3">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  
                  <span className="text-xl">{routine.task_icon}</span>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{routine.task_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {routine.is_fixed && routine.scheduled_time
                        ? formatTime(routine.scheduled_time)
                        : 'Flexível'}
                      {' • '}
                      {routine.estimated_duration}min
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openTaskForm(routine.id)}
                  >
                    ✏️
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(routine.id, routine.task_name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Botão adicionar */}
      <Button onClick={() => openTaskForm()} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar tarefa
      </Button>

      {/* TODO: Adicionar TaskForm modal aqui */}
    </PageContainer>
  );
}
```

**✅ Teste:** Acesse /routines - deve mostrar os dias da semana e lista vazia

---

## FASE 9: VISUALIZAÇÕES SEMANA E MÊS

### Comando 9.1: Criar Componente WeekView

```
Crie o arquivo src/components/calendar/WeekView.tsx:

'use client';

import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { cn, getCompletionBgColor } from '@/lib/utils';

interface DayData {
  date: Date;
  taskCount: number;
  completedCount: number;
  energy?: string;
}

interface WeekViewProps {
  days: DayData[];
  onDayClick: (date: Date) => void;
}

export function WeekView({ days, onDayClick }: WeekViewProps) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const percentage = day.taskCount > 0
          ? Math.round((day.completedCount / day.taskCount) * 100)
          : 0;
        const today = isToday(day.date);

        return (
          <Card
            key={day.date.toISOString()}
            className={cn(
              'p-2 cursor-pointer hover:bg-accent transition-colors text-center',
              today && 'ring-2 ring-primary'
            )}
            onClick={() => onDayClick(day.date)}
          >
            <p className="text-xs text-muted-foreground">
              {format(day.date, 'EEE', { locale: ptBR })}
            </p>
            <p className="text-lg font-bold">{format(day.date, 'd')}</p>
            
            {day.taskCount > 0 && (
              <>
                <div
                  className={cn(
                    'h-1.5 w-full rounded-full mt-1',
                    getCompletionBgColor(percentage)
                  )}
                  style={{ opacity: percentage / 100 || 0.2 }}
                />
                <p className="text-xs mt-1">{percentage}%</p>
              </>
            )}

            {day.energy && (
              <p className="text-xs mt-1">
                {day.energy === 'high' ? '🔋' : day.energy === 'medium' ? '🔋' : '🪫'}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 9.2: Criar Página Semana

```
Atualize o arquivo src/app/(main)/week/page.tsx:

'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { WeekView } from '@/components/calendar/WeekView';
import { useRoutineStore } from '@/stores/routineStore';
import { useRouter } from 'next/navigation';

export default function WeekPage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
  const { setSelectedDate } = useRoutineStore();
  const router = useRouter();

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // TODO: Buscar dados reais de task_logs e daily_status para a semana
  const dayData = days.map((date) => ({
    date,
    taskCount: 0, // TODO: buscar do banco
    completedCount: 0, // TODO: buscar do banco
    energy: undefined as string | undefined, // TODO: buscar do banco
  }));

  const navigateWeek = (direction: 'prev' | 'next') => {
    setWeekStart(direction === 'prev' ? subWeeks(weekStart, 1) : addWeeks(weekStart, 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    router.push('/');
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigateWeek('prev')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <h1 className="text-lg font-semibold">
          {format(weekStart, "d 'de' MMM", { locale: ptBR })} - {format(weekEnd, "d 'de' MMM", { locale: ptBR })}
        </h1>
        
        <Button variant="ghost" size="icon" onClick={() => navigateWeek('next')}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <WeekView days={dayData} onDayClick={handleDayClick} />
    </PageContainer>
  );
}
```

**✅ Teste:** Acesse /week - deve mostrar calendário da semana

---

### Comando 9.3: Criar Componente MonthView

```
Crie o arquivo src/components/calendar/MonthView.tsx:

'use client';

import { format, isToday, isSameMonth, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn, getCompletionBgColor } from '@/lib/utils';

interface DayData {
  date: Date;
  percentage: number;
  isPaused?: boolean;
}

interface MonthViewProps {
  month: Date;
  daysData: Map<string, DayData>;
  onDayClick: (date: Date) => void;
}

export function MonthView({ month, daysData, onDayClick }: MonthViewProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const dayData = daysData.get(dateKey);
          const inMonth = isSameMonth(date, month);
          const today = isToday(date);

          return (
            <button
              key={dateKey}
              onClick={() => onDayClick(date)}
              disabled={!inMonth}
              className={cn(
                'aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors',
                !inMonth && 'opacity-30',
                today && 'ring-2 ring-primary',
                dayData?.isPaused && 'bg-muted',
                dayData && !dayData.isPaused && getCompletionBgColor(dayData.percentage),
                dayData && !dayData.isPaused && 'text-white',
                !dayData && inMonth && 'hover:bg-accent'
              )}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 9.4: Criar Página Mês

```
Atualize o arquivo src/app/(main)/month/page.tsx:

'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { MonthView } from '@/components/calendar/MonthView';
import { useRoutineStore } from '@/stores/routineStore';
import { useRouter } from 'next/navigation';

export default function MonthPage() {
  const [month, setMonth] = useState(new Date());
  const { setSelectedDate } = useRoutineStore();
  const router = useRouter();

  // TODO: Buscar dados reais do banco para o mês
  const daysData = new Map();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setMonth(direction === 'prev' ? subMonths(month, 1) : addMonths(month, 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    router.push('/');
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <h1 className="text-lg font-semibold capitalize">
          {format(month, 'MMMM yyyy', { locale: ptBR })}
        </h1>
        
        <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <MonthView month={month} daysData={daysData} onDayClick={handleDayClick} />

      {/* Legenda */}
      <div className="flex justify-center gap-4 mt-6 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>&gt;80%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span>50-80%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span>&lt;50%</span>
        </div>
      </div>
    </PageContainer>
  );
}
```

**✅ Teste:** Acesse /month - deve mostrar calendário do mês

---

## FASE 10: TELA DO PARCEIRO

### Comando 10.1: Criar Componente FeedbackButtons

```
Crie o arquivo src/components/partner/FeedbackButtons.tsx:

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { FEEDBACK_MESSAGES } from '@/types';
import type { FeedbackType } from '@/types';
import { toast } from 'sonner';

interface FeedbackButtonsProps {
  partnerId: string;
}

export function FeedbackButtons({ partnerId }: FeedbackButtonsProps) {
  const [sending, setSending] = useState<FeedbackType | null>(null);
  const { user } = useAuthStore();
  const supabase = getSupabaseClient();

  const sendFeedback = async (type: FeedbackType) => {
    if (!user) return;

    setSending(type);
    try {
      const { error } = await supabase.from('feedbacks').insert({
        from_user_id: user.id,
        to_user_id: partnerId,
        feedback_type: type,
      });

      if (error) throw error;
      toast.success('Enviado! 💕');
    } catch (error) {
      toast.error('Erro ao enviar');
    } finally {
      setSending(null);
    }
  };

  const feedbackTypes: FeedbackType[] = ['great_job', 'you_can_do_it', 'need_help', 'making_coffee', 'im_here'];

  return (
    <div className="grid grid-cols-2 gap-2">
      {feedbackTypes.map((type) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          onClick={() => sendFeedback(type)}
          disabled={sending === type}
          className="h-auto py-2"
        >
          <span className="mr-1">{FEEDBACK_MESSAGES[type].icon}</span>
          <span className="text-xs">{FEEDBACK_MESSAGES[type].label}</span>
        </Button>
      ))}
    </div>
  );
}
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 10.2: Criar Página do Parceiro

```
Atualize o arquivo src/app/(main)/partner/page.tsx:

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { FeedbackButtons } from '@/components/partner/FeedbackButtons';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ENERGY_LABELS, MOOD_LABELS } from '@/types';
import type { DailyStatus, TaskLog } from '@/types';

export default function PartnerPage() {
  const { partner } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [partnerStatus, setPartnerStatus] = useState<DailyStatus | null>(null);
  const [partnerTasks, setPartnerTasks] = useState<TaskLog[]>([]);
  const supabase = getSupabaseClient();

  useEffect(() => {
    async function fetchPartnerData() {
      if (!partner) {
        setIsLoading(false);
        return;
      }

      const today = format(new Date(), 'yyyy-MM-dd');

      // Buscar status do dia
      const { data: status } = await supabase
        .from('daily_status')
        .select('*')
        .eq('user_id', partner.id)
        .eq('date', today)
        .single();

      // Buscar tarefas do dia
      const { data: tasks } = await supabase
        .from('task_logs')
        .select('*')
        .eq('user_id', partner.id)
        .eq('date', today);

      setPartnerStatus(status as DailyStatus | null);
      setPartnerTasks((tasks as TaskLog[]) || []);
      setIsLoading(false);
    }

    fetchPartnerData();
  }, [partner, supabase]);

  if (isLoading) return <LoadingPage />;

  if (!partner) {
    return (
      <PageContainer>
        <EmptyState
          icon="💔"
          title="Sem parceiro vinculado"
          description="Você precisa conectar com seu amor primeiro"
        />
      </PageContainer>
    );
  }

  const progress = partnerTasks.length > 0
    ? Math.round((partnerTasks.filter((t) => t.status === 'done').length / partnerTasks.length) * 100)
    : 0;

  const initials = partner.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <PageContainer>
      {/* Header do parceiro */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={partner.avatar_url || undefined} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-xl font-bold">{partner.name}</h1>
            
            {partnerStatus && (
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                {partnerStatus.energy_level && (
                  <span>{ENERGY_LABELS[partnerStatus.energy_level].icon} {ENERGY_LABELS[partnerStatus.energy_level].label}</span>
                )}
                {partnerStatus.mood && (
                  <span>{MOOD_LABELS[partnerStatus.mood].icon} {MOOD_LABELS[partnerStatus.mood].label}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progresso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progresso de hoje</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </Card>

      {/* Botões de feedback */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-3">Enviar uma mensagem de apoio:</h2>
        <FeedbackButtons partnerId={partner.id} />
      </div>

      {/* Tarefas do parceiro */}
      <div>
        <h2 className="text-sm font-medium mb-3">Tarefas de hoje:</h2>
        
        {partnerTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma tarefa registrada hoje
          </p>
        ) : (
          <div className="space-y-2">
            {partnerTasks.map((task) => (
              <Card key={task.id} className="p-3">
                <div className="flex items-center justify-between">
                  <span className={task.status === 'done' ? 'line-through text-muted-foreground' : ''}>
                    {task.task_name}
                  </span>
                  <span>
                    {task.status === 'done' ? '✅' : task.status === 'skipped' ? '⏭️' : '⬜'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
```

**✅ Teste:** Acesse /partner - deve mostrar dados do parceiro (ou empty state se não tiver)

---

## FASE 11: CONFIGURAÇÕES

### Comando 11.1: Criar Página de Configurações

```
Atualize o arquivo src/app/(main)/settings/page.tsx:

'use client';

import { useState } from 'react';
import { LogOut, Moon, Sun, User, Bell, Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useUIStore } from '@/stores/uiStore';
import { getSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, partner, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { openConfirmDialog } = useUIStore();
  const [name, setName] = useState(user?.name || '');
  const supabase = getSupabaseClient();

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
            onCheckedChange={(checked) => setTheme(checked ? 'midnight' : 'ocean')}
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
            <p className="font-medium">{partner.name}</p>
            <p className="text-sm text-muted-foreground">{partner.email}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum parceiro vinculado</p>
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
```

**✅ Teste:** Acesse /settings - deve mostrar configurações e trocar tema funciona

---

## FASE 12: PWA

### Comando 12.1: Configurar next-pwa

```
Atualize o arquivo next.config.js (ou next.config.ts se TypeScript):

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // suas outras configs aqui
};

module.exports = withPWA(nextConfig);
```

**✅ Teste:** `npm run build` passa sem erros

---

### Comando 12.2: Criar Manifest

```
Crie o arquivo public/manifest.json:

{
  "name": "Rotina a Dois",
  "short_name": "Rotina",
  "description": "Organize a rotina do casal de forma gentil",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#0891B2",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**✅ Teste:** Arquivo criado

---

### Comando 12.3: Criar Ícones PWA

```
Crie a pasta public/icons/ e adicione ícones placeholder.

Por enquanto, crie dois arquivos SVG simples ou use um gerador de ícones online.

Você pode criar depois ícones bonitos com o logo do app.
Os tamanhos necessários são: 192x192 e 512x512 pixels.
```

**✅ Teste:** Pasta public/icons/ existe

---

### Comando 12.4: Adicionar Meta Tags PWA

```
Atualize o arquivo src/app/layout.tsx para incluir as meta tags do PWA:

No head/metadata, adicione:

export const metadata = {
  title: 'Rotina a Dois',
  description: 'Organize a rotina do casal de forma gentil',
  manifest: '/manifest.json',
  themeColor: '#0891B2',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rotina a Dois',
  },
};

E no head adicione:
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

**✅ Teste:** `npm run build` passa

---

## FASE 13: POLIMENTO

### Comando 13.1: Adicionar ConfirmDialog Global

```
Atualize o arquivo src/app/(main)/layout.tsx para incluir o ConfirmDialog:

import { ConfirmDialog } from '@/components/common/ConfirmDialog';

E adicione <ConfirmDialog /> dentro do layout, junto com os outros componentes.
```

**✅ Teste:** Dialogs de confirmação funcionam

---

### Comando 13.2: Criar Arquivo de Mensagens

```
Crie o arquivo src/lib/messages.ts

Use EXATAMENTE o código da seção "9.1. Constantes de Mensagens" do TEMPLATES.md.

Isso centraliza todas as mensagens do app em português.
```

**✅ Teste:** Sem erros de TypeScript

---

### Comando 13.3: Revisar Loading States

```
Revise todas as páginas para garantir que têm:
1. Loading state enquanto carrega dados
2. Empty state quando não tem dados
3. Error state em caso de falha

Use os componentes LoadingPage e EmptyState que criamos.
```

**✅ Teste:** Todas as páginas têm os 3 estados

---

### Comando 13.4: Testar Temas

```
Teste o app nos dois temas:
1. Acesse /settings
2. Troque para tema Midnight
3. Navegue por todas as telas
4. Verifique se todas as cores estão corretas
5. Troque de volta para Oceano
6. Verifique novamente

Corrija qualquer problema de contraste ou cores hardcoded.
```

**✅ Teste:** Ambos os temas funcionam em todas as telas

---

### Comando 13.5: Testar Responsividade

```
Teste o app em diferentes tamanhos de tela:
1. Mobile pequeno (320px)
2. Mobile médio (375px)
3. Mobile grande (414px)
4. Tablet (768px)

Use o DevTools do navegador para simular.
Corrija qualquer problema de layout ou overflow.
```

**✅ Teste:** App funciona bem em todos os tamanhos

---

## FASE 14: DEPLOY

### ⚠️ AÇÃO MANUAL: Preparar Repositório

1. Crie um repositório no GitHub
2. Conecte seu projeto local ao repositório
3. Faça commit de todos os arquivos
4. Push para o GitHub

```bash
git init
git add .
git commit -m "feat: Rotina a Dois v1.0"
git branch -M main
git remote add origin https://github.com/seu-usuario/rotina-a-dois.git
git push -u origin main
```

**✅ Teste:** Código está no GitHub

---

### ⚠️ AÇÃO MANUAL: Deploy na Vercel

1. Acesse https://vercel.com
2. Clique em "Add New Project"
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique em "Deploy"
6. Aguarde o deploy completar

**✅ Teste:** App acessível na URL da Vercel

---

### ⚠️ AÇÃO MANUAL: Configurar Redirect URLs no Supabase

1. No Supabase, vá em Authentication > URL Configuration
2. Adicione a URL de produção:
   - `https://seu-app.vercel.app/auth/callback`

**✅ Teste:** Login funciona em produção

---

### Comando 14.1: Teste Final

```
Execute a lista de verificação final:

1. [ ] Login com email (magic link) funciona
2. [ ] Login redireciona para pareamento se não tem parceiro
3. [ ] Pareamento funciona com código
4. [ ] Dashboard carrega as rotinas
5. [ ] Criar tarefa na rotina funciona
6. [ ] Marcar tarefa como feita funciona
7. [ ] Seletor de energia/humor funciona
8. [ ] Visualização da semana funciona
9. [ ] Visualização do mês funciona
10. [ ] Página do parceiro mostra dados
11. [ ] Feedback para parceiro funciona
12. [ ] Configurações salvam corretamente
13. [ ] Troca de tema funciona
14. [ ] PWA pode ser instalado
15. [ ] App funciona bem no celular

Corrija qualquer problema encontrado.
```

**✅ Teste:** Todos os itens passam

---

## 🎉 PARABÉNS!

Se você chegou até aqui, o **Rotina a Dois** está pronto!

### Próximos passos opcionais:
- Criar ícones personalizados para o PWA
- Implementar notificações push
- Adicionar mais templates de tarefas
- Implementar streak completo
- Adicionar animações

### Suporte
Se tiver problemas, revise:
1. As variáveis de ambiente estão corretas?
2. O Supabase está configurado corretamente?
3. O RLS está habilitado nas tabelas?
4. Os templates foram inseridos?

Boa sorte com a rotina! 💑✨
