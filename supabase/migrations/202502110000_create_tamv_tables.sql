-- 1. Registro de Identidad Soberana con Soporte para 7 Federaciones
CREATE TABLE IF NOT EXISTS public.id_nvida_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    did TEXT UNIQUE NOT NULL,
    trust_level INT DEFAULT 0 CHECK (trust_level BETWEEN 0 AND 5),
    initiation_status TEXT DEFAULT 'pre_initiation',
    reputation_score DECIMAL DEFAULT 100.0,
    federation_sigs JSONB DEFAULT '[]', -- Almacena las firmas de los 7 nodos
    is_lockdown BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ledger MSR para Economía 75/25 y Auditoría
CREATE TABLE IF NOT EXISTS public.msr_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id TEXT,
    receiver_id TEXT,
    amount DECIMAL NOT NULL,
    split_ratio TEXT DEFAULT '75/25',
    operation_type TEXT NOT NULL,
    bookpi_hash TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Función para Reparto Automático (Funcionalidad Real)
CREATE OR REPLACE FUNCTION process_split_transaction(p_sender TEXT, p_receiver TEXT, p_amount DECIMAL)
RETURNS VOID AS $$
DECLARE
    creator_share DECIMAL;
    system_share DECIMAL;
BEGIN
    creator_share := p_amount * 0.75;
    system_share := p_amount * 0.25;
    
    INSERT INTO msr_ledger (sender_id, receiver_id, amount, operation_type, bookpi_hash)
    VALUES (p_sender, p_receiver, creator_share, 'CREATOR_PAYOUT', encode(digest(now()::text, 'sha256'), 'hex'));
    
    INSERT INTO msr_ledger (sender_id, receiver_id, amount, operation_type, bookpi_hash)
    VALUES (p_sender, 'SYSTEM_RESERVE', system_share, 'FENIX_FUND', encode(digest(p_sender || now()::text, 'sha256'), 'hex'));
END;
$$ LANGUAGE plpgsql;
