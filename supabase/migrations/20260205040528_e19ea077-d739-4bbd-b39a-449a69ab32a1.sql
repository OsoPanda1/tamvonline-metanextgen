-- TAMV SECURITY HARDENING v2
-- Corrige vulnerabilidades restantes detectadas

-- 1. GOVERNANCE_RULES: Solo admins pueden modificar
DROP POLICY IF EXISTS "Only admins can insert governance rules" ON public.governance_rules;
CREATE POLICY "Only admins can insert governance rules"
ON public.governance_rules
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Only admins can update governance rules" ON public.governance_rules;
CREATE POLICY "Only admins can update governance rules"
ON public.governance_rules
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Only admins can delete governance rules" ON public.governance_rules;
CREATE POLICY "Only admins can delete governance rules"
ON public.governance_rules
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 2. MISSIONS: Solo admins pueden gestionar
DROP POLICY IF EXISTS "Only admins can insert missions" ON public.missions;
CREATE POLICY "Only admins can insert missions"
ON public.missions
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Only admins can update missions" ON public.missions;
CREATE POLICY "Only admins can update missions"
ON public.missions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Only admins can delete missions" ON public.missions;
CREATE POLICY "Only admins can delete missions"
ON public.missions
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 3. XR_WORLDS: Solo admins/creators pueden gestionar
DROP POLICY IF EXISTS "Creators can insert worlds" ON public.xr_worlds;
CREATE POLICY "Creators can insert worlds"
ON public.xr_worlds
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'creator'))
);

DROP POLICY IF EXISTS "Creators can update worlds" ON public.xr_worlds;
CREATE POLICY "Creators can update worlds"
ON public.xr_worlds
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'creator'))
);

DROP POLICY IF EXISTS "Creators can delete worlds" ON public.xr_worlds;
CREATE POLICY "Creators can delete worlds"
ON public.xr_worlds
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 4. Restringir profiles SELECT a usuarios autenticados
DROP POLICY IF EXISTS "Public profiles limited view" ON public.profiles;
CREATE POLICY "Authenticated can view profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);