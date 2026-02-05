-- TAMV SECURITY: Completar políticas faltantes (evitando duplicados)

-- 8. MARKETPLACE_ITEMS: Políticas faltantes
DROP POLICY IF EXISTS "Sellers can update own items" ON public.marketplace_items;
CREATE POLICY "Sellers can update own items"
ON public.marketplace_items
FOR UPDATE
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers can delete own items" ON public.marketplace_items;
CREATE POLICY "Sellers can delete own items"
ON public.marketplace_items
FOR DELETE
USING (auth.uid() = seller_id);

-- 9. USER_MISSIONS: Políticas de protección
DROP POLICY IF EXISTS "Users can update own missions" ON public.user_missions;
CREATE POLICY "Users can update own missions"
ON public.user_missions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users cannot delete missions" ON public.user_missions;
CREATE POLICY "Users cannot delete missions"
ON public.user_missions
FOR DELETE
USING (false);

-- 10. INTENTIONS: Políticas de seguridad
DROP POLICY IF EXISTS "Users can update own intentions" ON public.intentions;
CREATE POLICY "Users can update own intentions"
ON public.intentions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Intentions cannot be deleted" ON public.intentions;
CREATE POLICY "Intentions cannot be deleted"
ON public.intentions
FOR DELETE
USING (false);