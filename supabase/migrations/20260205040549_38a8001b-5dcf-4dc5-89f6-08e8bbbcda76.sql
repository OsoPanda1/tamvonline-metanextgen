-- TAMV ECONOMY: Función para transacciones seguras con distribución 20/30/50
-- Esta función asegura atomicidad e integridad en las transacciones

CREATE OR REPLACE FUNCTION public.create_transaction(
  p_from_user_id UUID,
  p_to_user_id UUID,
  p_amount NUMERIC,
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transaction_id UUID;
  v_from_balance NUMERIC;
  v_fenix_share NUMERIC;
  v_infra_share NUMERIC;
  v_reserve_share NUMERIC;
BEGIN
  -- Validar que el usuario tiene fondos suficientes
  IF p_from_user_id IS NOT NULL THEN
    SELECT balance INTO v_from_balance 
    FROM wallets 
    WHERE user_id = p_from_user_id;
    
    IF v_from_balance < p_amount THEN
      RAISE EXCEPTION 'Fondos insuficientes';
    END IF;
  END IF;
  
  -- Calcular distribución federada 20/30/50
  v_fenix_share := ROUND(p_amount * 0.20, 2);
  v_infra_share := ROUND(p_amount * 0.30, 2);
  v_reserve_share := ROUND(p_amount * 0.50, 2);
  
  -- Crear la transacción
  INSERT INTO transactions (
    from_user_id,
    to_user_id,
    amount,
    transaction_type,
    description,
    fenix_share,
    infra_share,
    reserve_share
  ) VALUES (
    p_from_user_id,
    p_to_user_id,
    p_amount,
    p_transaction_type,
    p_description,
    v_fenix_share,
    v_infra_share,
    v_reserve_share
  ) RETURNING id INTO v_transaction_id;
  
  -- Actualizar wallet del emisor
  IF p_from_user_id IS NOT NULL THEN
    UPDATE wallets 
    SET 
      balance = balance - p_amount,
      total_spent = total_spent + p_amount,
      updated_at = now()
    WHERE user_id = p_from_user_id;
  END IF;
  
  -- Actualizar wallet del receptor
  IF p_to_user_id IS NOT NULL THEN
    UPDATE wallets 
    SET 
      balance = balance + (p_amount - v_fenix_share - v_infra_share),
      total_earned = total_earned + (p_amount - v_fenix_share - v_infra_share),
      updated_at = now()
    WHERE user_id = p_to_user_id;
  END IF;
  
  RETURN v_transaction_id;
END;
$$;

-- Función para reclamar recompensa de misión
CREATE OR REPLACE FUNCTION public.claim_mission_reward(
  p_user_id UUID,
  p_mission_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mission RECORD;
  v_user_mission RECORD;
BEGIN
  -- Obtener datos de la misión
  SELECT * INTO v_mission FROM missions WHERE id = p_mission_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Misión no encontrada o inactiva';
  END IF;
  
  -- Verificar que el usuario completó la misión
  SELECT * INTO v_user_mission 
  FROM user_missions 
  WHERE user_id = p_user_id AND mission_id = p_mission_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no tiene esta misión';
  END IF;
  
  IF v_user_mission.progress < 100 THEN
    RAISE EXCEPTION 'Misión no completada';
  END IF;
  
  IF v_user_mission.claimed_at IS NOT NULL THEN
    RAISE EXCEPTION 'Recompensa ya reclamada';
  END IF;
  
  -- Marcar como reclamada
  UPDATE user_missions 
  SET 
    claimed_at = now(),
    completed_at = COALESCE(completed_at, now())
  WHERE user_id = p_user_id AND mission_id = p_mission_id;
  
  -- Otorgar recompensa TAU
  IF v_mission.tau_reward > 0 THEN
    UPDATE wallets 
    SET 
      balance = balance + v_mission.tau_reward,
      total_earned = total_earned + v_mission.tau_reward,
      updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
  
  -- Actualizar misiones completadas en perfil
  UPDATE profiles 
  SET 
    missions_completed = missions_completed + 1,
    reputation_score = LEAST(reputation_score + 5, 100),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$;