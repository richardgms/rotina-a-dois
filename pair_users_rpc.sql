-- Function to handle pairing securely
CREATE OR REPLACE FUNCTION pair_users(partner_code_input TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of creator (admin), bypassing RLS
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  partner_record RECORD;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if authenticated
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Usuário não autenticado');
  END IF;

  -- Find partner by code
  SELECT * INTO partner_record
  FROM users
  WHERE pairing_code = UPPER(partner_code_input);

  -- Validations
  IF partner_record IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Código inválido');
  END IF;

  IF partner_record.id = current_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Você não pode parear com você mesmo');
  END IF;

  IF partner_record.partner_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Este usuário já tem um parceiro');
  END IF;

  -- Verify if I already have a partner (optional safety check)
  IF EXISTS (SELECT 1 FROM users WHERE id = current_user_id AND partner_id IS NOT NULL) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Você já tem um parceiro vinculado');
  END IF;

  -- Perform updates
  -- Update me
  UPDATE users 
  SET partner_id = partner_record.id
  WHERE id = current_user_id;

  -- Update partner
  UPDATE users 
  SET partner_id = current_user_id
  WHERE id = partner_record.id;

  RETURN jsonb_build_object('success', true, 'partner', row_to_json(partner_record));
END;
$$;
