-- 1. Drop the recursive policy
DROP POLICY IF EXISTS "Users can view own and partner data" ON users;

-- 2. Create a secure function to get partner_id avoiding recursion
CREATE OR REPLACE FUNCTION get_my_partner_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT partner_id FROM users WHERE id = auth.uid()
$$;

-- 3. Recreate the policy using the function
CREATE POLICY "Users can view own and partner data" ON users
  FOR SELECT USING (
    auth.uid() = id OR 
    id = get_my_partner_id()
  );
