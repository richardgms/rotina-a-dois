-- 1. Criar tabela de notificações
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'pairing_request', 'pairing_accepted', 'pairing_rejected'
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}', -- dados extras (ex: {from_user_id, from_user_name})
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para buscar notificações do usuário
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = FALSE;

-- RLS para notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Permitir inserção via RPC (sistema)
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);


-- 2. Criar tabela de solicitações pendentes
CREATE TABLE pairing_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

-- RLS para pairing_requests
ALTER TABLE pairing_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view requests involving them"
  ON pairing_requests FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);


-- 3. Criar RPC para enviar solicitação
CREATE OR REPLACE FUNCTION send_pairing_request(partner_code_input TEXT)
RETURNS JSONB AS $$
DECLARE
  current_user_id UUID;
  target_user RECORD;
  existing_request RECORD;
BEGIN
  current_user_id := auth.uid();
  
  -- Buscar usuário pelo código
  SELECT id, name, email INTO target_user 
  FROM users 
  WHERE pairing_code = UPPER(partner_code_input);
  
  IF target_user.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Código não encontrado');
  END IF;
  
  IF target_user.id = current_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Você não pode se vincular a si mesmo');
  END IF;
  
  -- Verificar se já existe solicitação pendente
  SELECT * INTO existing_request 
  FROM pairing_requests 
  WHERE (from_user_id = current_user_id AND to_user_id = target_user.id)
     OR (from_user_id = target_user.id AND to_user_id = current_user_id)
  AND status = 'pending';
  
  IF existing_request.id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Já existe uma solicitação pendente');
  END IF;
  
  -- Criar solicitação
  INSERT INTO pairing_requests (from_user_id, to_user_id, status)
  VALUES (current_user_id, target_user.id, 'pending');
  
  -- Criar notificação para o destinatário
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (
    target_user.id,
    'pairing_request',
    'Solicitação de Pareamento',
    (SELECT name FROM users WHERE id = current_user_id) || ' quer ser seu parceiro(a)!',
    jsonb_build_object('from_user_id', current_user_id, 'from_user_name', (SELECT name FROM users WHERE id = current_user_id))
  );
  
  RETURN jsonb_build_object('success', true, 'message', 'Solicitação enviada!');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Criar RPC para aceitar/rejeitar
CREATE OR REPLACE FUNCTION respond_pairing_request(request_id UUID, accept BOOLEAN)
RETURNS JSONB AS $$
DECLARE
  current_user_id UUID;
  request RECORD;
BEGIN
  current_user_id := auth.uid();
  
  SELECT * INTO request FROM pairing_requests WHERE id = request_id AND to_user_id = current_user_id;
  
  IF request.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Solicitação não encontrada');
  END IF;
  
  IF request.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Solicitação já foi respondida');
  END IF;
  
  IF accept THEN
    -- Vincular ambos os usuários
    UPDATE users SET partner_id = request.from_user_id WHERE id = current_user_id;
    UPDATE users SET partner_id = current_user_id WHERE id = request.from_user_id;
    
    -- Atualizar status
    UPDATE pairing_requests SET status = 'accepted', updated_at = NOW() WHERE id = request_id;
    
    -- Notificar quem enviou
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      request.from_user_id,
      'pairing_accepted',
      'Pareamento Aceito! 💕',
      (SELECT name FROM users WHERE id = current_user_id) || ' aceitou seu convite!',
      jsonb_build_object('partner_id', current_user_id)
    );
    
    RETURN jsonb_build_object('success', true, 'message', 'Pareamento realizado com sucesso!');
  ELSE
    -- Rejeitar
    UPDATE pairing_requests SET status = 'rejected', updated_at = NOW() WHERE id = request_id;
    
    -- Notificar quem enviou
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      request.from_user_id,
      'pairing_rejected',
      'Solicitação Recusada',
      (SELECT name FROM users WHERE id = current_user_id) || ' recusou o convite.',
      jsonb_build_object('from_user_id', current_user_id)
    );
    
    RETURN jsonb_build_object('success', true, 'message', 'Solicitação recusada');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
