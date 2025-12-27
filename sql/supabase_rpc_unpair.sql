-- SQL ATUALIZADO para desvinculação com notificação
-- Execute no SQL Editor do Supabase

-- 1. Primeiro, dropar a função antiga se existir
DROP FUNCTION IF EXISTS unpair_users(UUID);

-- 2. Criar a função melhorada que também envia notificação
CREATE OR REPLACE FUNCTION unpair_users(user_id UUID)
RETURNS JSONB AS $$
DECLARE
    partner_uuid UUID;
    user_name TEXT;
    result JSONB;
BEGIN
    -- Pegar o partner_id e nome do usuário que solicitou
    SELECT partner_id, name INTO partner_uuid, user_name 
    FROM users 
    WHERE id = user_id;
    
    -- Se não tiver parceiro, retorna erro
    IF partner_uuid IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Você não está vinculado a nenhum parceiro'
        );
    END IF;

    -- Limpar o partner_id do usuário atual
    UPDATE users SET partner_id = NULL, updated_at = NOW() WHERE id = user_id;
    
    -- Limpar o partner_id do ex-parceiro
    UPDATE users SET partner_id = NULL, updated_at = NOW() WHERE id = partner_uuid;
    
    -- Criar notificação para o ex-parceiro informando da desvinculação
    INSERT INTO notifications (user_id, type, title, message, data, read)
    VALUES (
        partner_uuid,
        'partner_unpaired',
        'Parceiro desvinculou',
        user_name || ' desvinculou de você.',
        jsonb_build_object(
            'from_user_id', user_id,
            'from_user_name', user_name
        ),
        false
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Desvinculação realizada com sucesso'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Conceder permissão para usuários autenticados chamarem a função
GRANT EXECUTE ON FUNCTION unpair_users(UUID) TO authenticated;

-- 4. Verificar se a tabela notifications tem a coluna type correta
-- Se não tiver o tipo 'partner_unpaired', pode ser necessário atualizar o check constraint
-- ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
-- ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
--   CHECK (type IN ('pairing_request', 'pairing_accepted', 'pairing_rejected', 'partner_unpaired'));

-- IMPORTANTE: Execute este SQL no Supabase para atualizar a função!
