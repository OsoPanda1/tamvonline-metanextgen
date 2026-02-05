-- FIX: Permitir INSERT en transactions via función SECURITY DEFINER
DROP POLICY IF EXISTS "System can insert transactions" ON public.transactions;
-- Las transacciones se insertan via create_transaction() que usa SECURITY DEFINER