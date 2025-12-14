# IMPLEMENTAÇÃO - ROTINA A DOIS

## Guia de Implementação Passo a Passo
**Siga na ordem. Não pule etapas. Teste antes de avançar.**

---

## FASE 1: SETUP DO PROJETO

### 1.1. Criar Projeto Next.js
- [ ] Criar projeto com `npx create-next-app@latest rotina-a-dois`
- [ ] Opções: TypeScript ✓, Tailwind ✓, ESLint ✓, App Router ✓, src/ ✓
- [ ] Verificar se roda com `npm run dev`

### 1.2. Instalar Dependências
```bash
# shadcn/ui
npx shadcn@latest init

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Estado
npm install zustand immer

# Utilitários
npm install date-fns lucide-react

# PWA
npm install next-pwa
```

### 1.3. Configurar shadcn/ui
- [ ] Instalar componentes necessários:
```bash
npx shadcn@latest add button card checkbox dialog dropdown-menu input label progress select sheet skeleton switch tabs toast
```

### 1.4. Criar Estrutura de Pastas
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── pairing/
│   │       └── page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── week/
│   │   │   └── page.tsx
│   │   ├── month/
│   │   │   └── page.tsx
│   │   ├── partner/
│   │   │   └── page.tsx
│   │   ├── routines/
│   │   │   └── page.tsx
│   │   ├── suggestions/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn (já existe)
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
```

### 1.5. Configurar Variáveis de Ambiente
Criar arquivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_aqui
```

### 1.6. Configurar Temas no globals.css
- [ ] Adicionar CSS variables do tema Oceano (`:root`)
- [ ] Adicionar CSS variables do tema Midnight (`[data-theme="midnight"]`)
- [ ] Configurar fonte Inter

**✅ Checkpoint:** Projeto roda sem erros, estrutura de pastas criada.

---

## FASE 2: SUPABASE SETUP

### 2.1. Criar Projeto no Supabase
- [ ] Acessar supabase.com e criar novo projeto
- [ ] Anotar URL e anon key
- [ ] Atualizar `.env.local`

### 2.2. Criar Tabelas
Executar no SQL Editor do Supabase:

#### Tabela users
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

#### Tabela task_templates
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

#### Tabela routines
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

#### Tabela task_logs
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

#### Tabela daily_status
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

#### Tabela suggestions
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

#### Tabela feedbacks
```sql
CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabela pause_periods
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

#### Tabela streaks
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

### 2.3. Configurar Row Level Security (RLS)
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

-- Policy para users (ver próprio + parceiro)
CREATE POLICY "Users can view own and partner data" ON users
  FOR SELECT USING (
    auth.uid() = id OR 
    id = (SELECT partner_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

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

-- Policy para suggestions (envolvidos podem ver)
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

-- Policy para task_templates (todos podem ver sistema, próprios podem gerenciar)
CREATE POLICY "Anyone can view system templates" ON task_templates
  FOR SELECT USING (is_system = true);

CREATE POLICY "Users can manage own templates" ON task_templates
  FOR ALL USING (auth.uid() = created_by);
```

### 2.4. Inserir Templates de Tarefas
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

### 2.5. Configurar Auth no Supabase
- [ ] Em Authentication > Providers, habilitar Email (Magic Link)
- [ ] Opcional: habilitar Google OAuth
- [ ] Em Authentication > URL Configuration, adicionar redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://seu-dominio.vercel.app/auth/callback`

### 2.6. Criar Clientes Supabase no Projeto
- [ ] Criar `src/lib/supabase/client.ts` (browser client)
- [ ] Criar `src/lib/supabase/server.ts` (server client)
- [ ] Criar `src/lib/supabase/middleware.ts` (middleware para refresh de sessão)

**✅ Checkpoint:** Supabase configurado, tabelas criadas, RLS ativo, templates inseridos.

---

## FASE 3: AUTENTICAÇÃO

### 3.1. Criar Types
- [ ] Criar `src/types/index.ts` com todas as interfaces:
  - User, Routine, TaskLog, DailyStatus, Suggestion, Feedback, etc.

### 3.2. Criar Auth Store
- [ ] Criar `src/stores/authStore.ts` com Zustand
- [ ] Estados: user, partner, isLoading, isAuthenticated
- [ ] Actions: setUser, setPartner, logout

### 3.3. Criar Hook useAuth
- [ ] Criar `src/hooks/useAuth.ts`
- [ ] Funções: signIn, signOut, getCurrentUser, getPartner

### 3.4. Criar Página de Login
- [ ] Criar `src/app/(auth)/login/page.tsx`
- [ ] Input de email
- [ ] Botão "Enviar link de acesso"
- [ ] Feedback visual (loading, sucesso, erro)
- [ ] Opcional: botão Google

### 3.5. Criar Auth Callback
- [ ] Criar `src/app/auth/callback/route.ts`
- [ ] Trocar code por session
- [ ] Redirecionar para dashboard ou pareamento

### 3.6. Criar Página de Pareamento
- [ ] Criar `src/app/(auth)/pairing/page.tsx`
- [ ] Exibir código do usuário (gerar se não existir)
- [ ] Input para inserir código do parceiro
- [ ] Função de vincular parceiros

### 3.7. Criar Middleware de Proteção
- [ ] Criar `src/middleware.ts`
- [ ] Proteger rotas /main/*
- [ ] Redirecionar não autenticados para /login
- [ ] Redirecionar não pareados para /pairing

**✅ Checkpoint:** Login funciona, pareamento funciona, rotas protegidas.

---

## FASE 4: LAYOUT E NAVEGAÇÃO

### 4.1. Criar Componente Header
- [ ] Criar `src/components/layout/Header.tsx`
- [ ] Logo/nome do app
- [ ] Saudação com nome do usuário
- [ ] Streak atual

### 4.2. Criar Componente BottomNav
- [ ] Criar `src/components/layout/BottomNav.tsx`
- [ ] 5 itens: Hoje, Semana, Mês, Parceiro, Config
- [ ] Ícones do Lucide
- [ ] Indicador de página ativa
- [ ] Fixa no bottom em mobile

### 4.3. Criar Layout Principal
- [ ] Criar `src/app/(main)/layout.tsx`
- [ ] Incluir Header
- [ ] Área de conteúdo com padding para BottomNav
- [ ] Incluir BottomNav
- [ ] Provider de tema

### 4.4. Criar Componente PageContainer
- [ ] Criar `src/components/layout/PageContainer.tsx`
- [ ] Padding consistente
- [ ] Max-width em telas grandes
- [ ] Centralização

### 4.5. Implementar Sistema de Temas
- [ ] Criar `src/hooks/useTheme.ts`
- [ ] Ler tema do usuário do banco
- [ ] Aplicar data-theme no html
- [ ] Função para trocar tema

**✅ Checkpoint:** Layout funciona, navegação funciona, temas funcionam.

---

## FASE 5: DASHBOARD (MEU DIA)

### 5.1. Criar Stores Necessárias
- [ ] Criar `src/stores/routineStore.ts`
- [ ] Criar `src/stores/uiStore.ts` (modals, loading states)

### 5.2. Criar Hooks de Dados
- [ ] Criar `src/hooks/useRoutines.ts`
- [ ] Criar `src/hooks/useTaskLogs.ts`
- [ ] Criar `src/hooks/useDailyStatus.ts`

### 5.3. Criar Componente EnergyMoodPicker
- [ ] Criar `src/components/dashboard/EnergyMoodPicker.tsx`
- [ ] Modal que aparece ao abrir app (se não preencheu hoje)
- [ ] Seleção de energia: Alta, Média, Baixa
- [ ] Seleção de humor: Bem, Meh, Difícil
- [ ] Botão pular
- [ ] Salvar no daily_status

### 5.4. Criar Componente DayProgress
- [ ] Criar `src/components/dashboard/DayProgress.tsx`
- [ ] Barra de progresso visual
- [ ] Porcentagem
- [ ] Cores dinâmicas

### 5.5. Criar Componente TaskItem
- [ ] Criar `src/components/dashboard/TaskItem.tsx`
- [ ] Checkbox
- [ ] Ícone + nome
- [ ] Horário ou "Flexível"
- [ ] Tempo estimado
- [ ] Indicador de subtarefas
- [ ] Status visual
- [ ] Expandir para ver subtarefas/nota
- [ ] Ações: Feito, Pulei, Adiar

### 5.6. Criar Componente TaskList
- [ ] Criar `src/components/dashboard/TaskList.tsx`
- [ ] Lista de TaskItems
- [ ] Separação por período (Manhã, Tarde, Noite) se flexíveis
- [ ] Tarefas fixas por horário
- [ ] Empty state

### 5.7. Criar Componente FocusMode
- [ ] Criar `src/components/dashboard/FocusMode.tsx`
- [ ] Botão "O que fazer agora?"
- [ ] Mostra só próxima tarefa
- [ ] Botão "Ver tudo"

### 5.8. Criar Componente PartnerCard
- [ ] Criar `src/components/dashboard/PartnerCard.tsx`
- [ ] Mini card com foto/nome do parceiro
- [ ] Energia/humor dele
- [ ] % progresso dele
- [ ] Link para tela do parceiro

### 5.9. Criar Componente DifficultDayButton
- [ ] Criar `src/components/dashboard/DifficultDayButton.tsx`
- [ ] Botão "Dia difícil"
- [ ] Confirmação
- [ ] Ativa rotina mínima
- [ ] Mensagem acolhedora

### 5.10. Criar Página Dashboard
- [ ] Criar `src/app/(main)/page.tsx`
- [ ] Integrar todos os componentes
- [ ] Navegação entre dias (← hoje →)
- [ ] Buscar dados do dia
- [ ] Loading e error states

**✅ Checkpoint:** Dashboard completo e funcional.

---

## FASE 6: VISUALIZAÇÃO SEMANAL

### 6.1. Criar Componente WeekView
- [ ] Criar `src/components/calendar/WeekView.tsx`
- [ ] 7 colunas (dias da semana)
- [ ] Cada dia mostra: data, qtd tarefas, % cumprido
- [ ] Indicador de energia (bolinha colorida)
- [ ] Destaque no dia atual

### 6.2. Criar Página Semana
- [ ] Criar `src/app/(main)/week/page.tsx`
- [ ] WeekView
- [ ] Navegação entre semanas
- [ ] Toque no dia = vai pro dashboard desse dia

**✅ Checkpoint:** Visualização semanal funciona.

---

## FASE 7: VISUALIZAÇÃO MENSAL

### 7.1. Criar Componente MonthView
- [ ] Criar `src/components/calendar/MonthView.tsx`
- [ ] Calendário tradicional
- [ ] Cores por cumprimento (verde/amarelo/vermelho/cinza)
- [ ] Indicador de dias pausados

### 7.2. Criar Componente DayCell
- [ ] Criar `src/components/calendar/DayCell.tsx`
- [ ] Número do dia
- [ ] Cor de fundo por status
- [ ] Toque = abre detalhes

### 7.3. Criar Página Mês
- [ ] Criar `src/app/(main)/month/page.tsx`
- [ ] MonthView
- [ ] Navegação entre meses
- [ ] Modal/Sheet de detalhes do dia ao tocar

**✅ Checkpoint:** Calendário mensal funciona.

---

## FASE 8: EDITOR DE ROTINAS

### 8.1. Criar Componente TemplateGallery
- [ ] Criar `src/components/routines/TemplateGallery.tsx`
- [ ] Grid de templates por categoria
- [ ] Busca/filtro
- [ ] Selecionar template

### 8.2. Criar Componente SubtaskList
- [ ] Criar `src/components/routines/SubtaskList.tsx`
- [ ] Lista de subtarefas
- [ ] Adicionar/remover
- [ ] Reordenar (drag and drop ou botões)

### 8.3. Criar Componente TaskForm
- [ ] Criar `src/components/routines/TaskForm.tsx`
- [ ] Campos: nome, ícone, categoria
- [ ] Tipo: fixa/flexível
- [ ] Horário ou período
- [ ] Duração estimada
- [ ] Lembrete (minutos antes)
- [ ] Aviso de transição (switch)
- [ ] Subtarefas
- [ ] Nota

### 8.4. Criar Componente RoutineEditor
- [ ] Criar `src/components/routines/RoutineEditor.tsx`
- [ ] Tabs ou select de dias da semana
- [ ] Lista de tarefas do dia selecionado
- [ ] Reordenar tarefas
- [ ] Botão adicionar (abre TaskForm)
- [ ] Swipe/botão deletar
- [ ] Botão clonar para outros dias

### 8.5. Criar Página de Rotinas
- [ ] Criar `src/app/(main)/routines/page.tsx`
- [ ] RoutineEditor
- [ ] Aba especial para "Dia Difícil"

**✅ Checkpoint:** Editor de rotinas completo.

---

## FASE 9: TELA DO PARCEIRO

### 9.1. Criar Hook usePartner
- [ ] Criar `src/hooks/usePartner.ts`
- [ ] Buscar dados do parceiro
- [ ] Rotinas dele
- [ ] Status do dia dele
- [ ] Task logs dele

### 9.2. Criar Componente FeedbackButtons
- [ ] Criar `src/components/partner/FeedbackButtons.tsx`
- [ ] 5 botões de feedback rápido
- [ ] Ao clicar: salva no banco + notifica parceiro
- [ ] Feedback visual de enviado

### 9.3. Criar Componente SuggestionForm
- [ ] Criar `src/components/partner/SuggestionForm.tsx`
- [ ] Input de texto
- [ ] Ou selecionar template
- [ ] Enviar sugestão

### 9.4. Criar Componente PartnerDashboard
- [ ] Criar `src/components/partner/PartnerDashboard.tsx`
- [ ] Mesmo layout do dashboard, mas do parceiro
- [ ] Pode marcar tarefas dele como "Vi que fez"
- [ ] Botão "Eu faço essa" (assumir tarefa)

### 9.5. Criar Página do Parceiro
- [ ] Criar `src/app/(main)/partner/page.tsx`
- [ ] Status do parceiro (energia/humor)
- [ ] PartnerDashboard
- [ ] FeedbackButtons
- [ ] Botão para enviar sugestão

**✅ Checkpoint:** Tela do parceiro funciona.

---

## FASE 10: SUGESTÕES

### 10.1. Criar Hook useSuggestions
- [ ] Criar `src/hooks/useSuggestions.ts`
- [ ] Listar sugestões recebidas
- [ ] Enviar sugestão
- [ ] Aceitar/recusar

### 10.2. Criar Página de Sugestões
- [ ] Criar `src/app/(main)/suggestions/page.tsx`
- [ ] Lista de sugestões pendentes
- [ ] Card com: remetente, conteúdo, data
- [ ] Botões: Aceitar, Recusar
- [ ] Ao aceitar: abre TaskForm pré-preenchido
- [ ] Empty state

**✅ Checkpoint:** Sistema de sugestões funciona.

---

## FASE 11: CONFIGURAÇÕES

### 11.1. Criar Página de Configurações
- [ ] Criar `src/app/(main)/settings/page.tsx`
- [ ] Seções: Perfil, Aparência, Notificações, Parceiro, Dados

### 11.2. Seção Perfil
- [ ] Nome de exibição (editável)
- [ ] Foto (upload)
- [ ] Email (somente leitura)

### 11.3. Seção Aparência
- [ ] Seletor de tema (Oceano/Midnight)
- [ ] Tamanho da fonte
- [ ] Primeiro dia da semana

### 11.4. Seção Notificações
- [ ] Switch geral
- [ ] Switches por tipo
- [ ] Horário silencioso (início/fim)

### 11.5. Seção Parceiro
- [ ] Nome do parceiro
- [ ] Botão desvincular (com confirmação)
- [ ] Gerar novo código de pareamento

### 11.6. Seção Dados
- [ ] Exportar dados (JSON)
- [ ] Limpar histórico
- [ ] Excluir conta (com confirmação dupla)

**✅ Checkpoint:** Configurações funcionam.

---

## FASE 12: NOTIFICAÇÕES (PWA)

### 12.1. Configurar next-pwa
- [ ] Configurar `next.config.js` com next-pwa
- [ ] Criar `public/manifest.json`
- [ ] Criar ícones PWA (192x192, 512x512)

### 12.2. Criar Hook useNotifications
- [ ] Criar `src/hooks/useNotifications.ts`
- [ ] Pedir permissão
- [ ] Registrar service worker
- [ ] Enviar notificação local

### 12.3. Implementar Lembretes
- [ ] Agendar notificações para tarefas
- [ ] Aviso de transição (10min antes)
- [ ] Lembrete de tarefa atrasada

### 12.4. Notificações de Parceiro
- [ ] Receber feedback em tempo real (Supabase Realtime)
- [ ] Mostrar notificação quando parceiro envia feedback

**✅ Checkpoint:** PWA funciona, notificações funcionam.

---

## FASE 13: PAUSAR ROTINA

### 13.1. Criar Hook usePause
- [ ] Criar `src/hooks/usePause.ts`
- [ ] Verificar se está pausado
- [ ] Ativar pausa
- [ ] Desativar pausa

### 13.2. Implementar UI de Pausa
- [ ] Botão nas configurações ou atalho no dashboard
- [ ] Modal: data início, data fim, motivo
- [ ] Indicador visual quando pausado
- [ ] Bloquear notificações durante pausa

**✅ Checkpoint:** Sistema de pausa funciona.

---

## FASE 14: STREAK

### 14.1. Criar Hook useStreak
- [ ] Criar `src/hooks/useStreak.ts`
- [ ] Calcular streak atual
- [ ] Atualizar ao completar dia
- [ ] Salvar recorde

### 14.2. Implementar UI de Streak
- [ ] Exibir no Header
- [ ] Animação ao aumentar streak
- [ ] Exibir recorde nas configurações

**✅ Checkpoint:** Sistema de streak funciona.

---

## FASE 15: POLIMENTO

### 15.1. Loading States
- [ ] Skeleton em todas as listas
- [ ] Spinner em ações
- [ ] Disabled em botões durante loading

### 15.2. Empty States
- [ ] Dashboard sem tarefas
- [ ] Sugestões vazias
- [ ] Calendário sem dados

### 15.3. Error States
- [ ] Componente de erro global
- [ ] Toast para erros de ação
- [ ] Retry automático em falhas de rede

### 15.4. Toasts
- [ ] Configurar toast provider
- [ ] Sucesso ao salvar
- [ ] Erro ao falhar
- [ ] Info para feedbacks recebidos

### 15.5. Animações
- [ ] Transições de página suaves
- [ ] Animação de checkbox
- [ ] Animação de progresso

### 15.6. Acessibilidade
- [ ] Verificar todos os aria-labels
- [ ] Testar navegação por teclado
- [ ] Verificar contraste

### 15.7. Responsividade
- [ ] Testar em 320px (mobile pequeno)
- [ ] Testar em 375px (iPhone)
- [ ] Testar em 768px (tablet)
- [ ] Testar em desktop

**✅ Checkpoint:** App polido e acessível.

---

## FASE 16: DEPLOY

### 16.1. Preparar para Produção
- [ ] Remover console.logs
- [ ] Verificar variáveis de ambiente
- [ ] Rodar `npm run build` sem erros
- [ ] Testar build local com `npm run start`

### 16.2. Deploy na Vercel
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Deploy

### 16.3. Configurar Domínio (opcional)
- [ ] Adicionar domínio customizado
- [ ] Configurar DNS

### 16.4. Configurar Supabase para Produção
- [ ] Atualizar redirect URLs no Supabase Auth
- [ ] Verificar RLS está ativo

### 16.5. Testes Finais
- [ ] Testar login em produção
- [ ] Testar pareamento
- [ ] Testar todas as funcionalidades
- [ ] Testar PWA (instalar no celular)
- [ ] Testar notificações

**✅ Checkpoint:** App em produção e funcionando!

---

## RESUMO DAS FASES

| Fase | Descrição | Tempo Estimado |
|------|-----------|----------------|
| 1 | Setup do Projeto | ~1 hora |
| 2 | Supabase Setup | ~1 hora |
| 3 | Autenticação | ~2 horas |
| 4 | Layout e Navegação | ~1 hora |
| 5 | Dashboard (Meu Dia) | ~3 horas |
| 6 | Visualização Semanal | ~1 hora |
| 7 | Visualização Mensal | ~1.5 horas |
| 8 | Editor de Rotinas | ~2.5 horas |
| 9 | Tela do Parceiro | ~2 horas |
| 10 | Sugestões | ~1 hora |
| 11 | Configurações | ~1.5 horas |
| 12 | Notificações (PWA) | ~2 horas |
| 13 | Pausar Rotina | ~1 hora |
| 14 | Streak | ~30 min |
| 15 | Polimento | ~2 horas |
| 16 | Deploy | ~1 hora |
| **Total** | | **~24 horas** |

---

*Pode ser feito em 3-5 dias de trabalho focado.*
*Siga a ordem. Teste cada checkpoint antes de avançar.*
