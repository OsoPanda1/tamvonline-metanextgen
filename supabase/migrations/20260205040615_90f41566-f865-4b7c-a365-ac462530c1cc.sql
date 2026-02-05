-- TAMV SECURITY FINAL: Eliminar políticas públicas peligrosas y restringir acceso

-- 1. Eliminar política pública de profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 2. Eliminar política pública de registry
DROP POLICY IF EXISTS "Registry is public" ON public.registry;

-- 3. Asegurar que registry solo sea visible por el propietario
DROP POLICY IF EXISTS "Users can view own registry entries" ON public.registry;
CREATE POLICY "Users can view own registry entries"
ON public.registry
FOR SELECT
USING (auth.uid() = user_id);

-- 4. Asegurar políticas de inmutabilidad en registry
DROP POLICY IF EXISTS "Registry records are immutable" ON public.registry;
CREATE POLICY "Registry records are immutable"
ON public.registry
FOR UPDATE
USING (false);

DROP POLICY IF EXISTS "Registry records cannot be deleted" ON public.registry;
CREATE POLICY "Registry records cannot be deleted"
ON public.registry
FOR DELETE
USING (false);

-- 5. Proteger wallets con UPDATE policy
DROP POLICY IF EXISTS "Users can update own wallet" ON public.wallets;
CREATE POLICY "Users can update own wallet"
ON public.wallets
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Proteger transactions - solo INSERT vía función SECURITY DEFINER
DROP POLICY IF EXISTS "System can insert transactions" ON public.transactions;
CREATE POLICY "System can insert transactions"
ON public.transactions
FOR INSERT
WITH CHECK (false); -- Las transacciones se insertan via función SECURITY DEFINER

-- 7. Proteger user_roles contra modificaciones no autorizadas
DROP POLICY IF EXISTS "Roles can only be granted by admins" ON public.user_roles;
CREATE POLICY "Roles can only be granted by admins"
ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Roles cannot be updated" ON public.user_roles;
CREATE POLICY "Roles cannot be updated"
ON public.user_roles
FOR UPDATE
USING (false);

DROP POLICY IF EXISTS "Roles can only be revoked by admins" ON public.user_roles;
CREATE POLICY "Roles can only be revoked by admins"
ON public.user_roles
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 8. Isabella messages - inmutabilidad
DROP POLICY IF EXISTS "Isabella messages are immutable" ON public.isabella_messages;
CREATE POLICY "Isabella messages are immutable"
ON public.isabella_messages
FOR UPDATE
USING (false);

DROP POLICY IF EXISTS "Users can delete own isabella messages" ON public.isabella_messages;
CREATE POLICY "Users can delete own isabella messages"
ON public.isabella_messages
FOR DELETE
USING (auth.uid() = user_id);