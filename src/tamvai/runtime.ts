/**
 * TAMVAI Runtime™ — Pipeline unificado de Seguridad, Monitoreo y Auditoría
 * Ejecuta el spec declarativo en cada operación.
 */

import { checkRateLimit, detectThreat, sanitizeInput, reportIncident } from '@/lib/tamv/anubis-sentinel';
import { log, recordMetric, startTrace } from '@/lib/tamv/horus';
import { scanEconomy, scanThreats } from '@/lib/tamv/radars';
import { receiveSignal, getEOCTState } from '@/lib/tamv/eoct';
import { anchorEvent } from '@/lib/tamv/bookpi';
import type { TamvaiOperation, SecurityTag, MonitoringTag, EmergencyPlan } from './spec';

// ── Runtime Context ──
export interface RuntimeContext {
  userId?: string;
  sessionToken?: string;
  ip?: string;
  userAgent?: string;
  timestamp: string;
  traceId: string;
}

export interface RuntimeResult {
  success: boolean;
  statusCode: number;
  data?: unknown;
  error?: string;
  traceId: string;
  securityChecks: SecurityCheckResult[];
  monitoringEvents: string[];
  auditLog?: AuditEntry;
}

export interface SecurityCheckResult {
  tag: SecurityTag;
  passed: boolean;
  detail?: string;
}

export interface AuditEntry {
  operationId: string;
  userId?: string;
  timestamp: string;
  traceId: string;
  inputRedacted: Record<string, unknown>;
  result: 'success' | 'failure' | 'blocked';
  emergencyPlan: EmergencyPlan;
}

// ── Emergency State ──
let emergencyMode: EmergencyPlan = 'NONE';

export function getEmergencyMode(): EmergencyPlan {
  return emergencyMode;
}

export function setEmergencyMode(mode: EmergencyPlan): void {
  emergencyMode = mode;
  log('critical', 'TAMVAI:Runtime', `Emergency mode set to ${mode}`);
  if (mode !== 'NONE') {
    receiveSignal('manual', mode === 'FULL_LOCKDOWN' ? 'LOCKDOWN' : 'CRITICAL', {
      type: 'EMERGENCY_MODE',
      mode,
    });
  }
}

// ── Security Pipeline ──
export async function applySecurity(
  op: TamvaiOperation,
  ctx: RuntimeContext,
  input?: Record<string, unknown>
): Promise<SecurityCheckResult[]> {
  const results: SecurityCheckResult[] = [];

  // ANUBIS: Authentication + Rate Limiting
  if (op.securityTags.includes('ANUBIS')) {
    // Rate limit check
    if (op.rateLimit) {
      const rateCheck = checkRateLimit(ctx.userId || ctx.ip || 'anonymous');
      if (!rateCheck.allowed) {
        results.push({ tag: 'ANUBIS', passed: false, detail: 'Rate limit exceeded' });
        await reportIncident('WARNING', 'TAMVAI:Anubis', `Rate limit: ${op.id}`, ctx.userId);
        return results;
      }
    }

    // Auth check
    if (op.auth.required && !ctx.sessionToken) {
      results.push({ tag: 'ANUBIS', passed: false, detail: 'Authentication required' });
      return results;
    }

    // Threat detection on input
    if (input) {
      const inputStr = JSON.stringify(input);
      const threat = detectThreat(inputStr);
      if (!threat.safe) {
        results.push({ tag: 'ANUBIS', passed: false, detail: `Threat detected: ${threat.threat}` });
        await reportIncident('CRITICAL', 'TAMVAI:Anubis', `Injection attempt on ${op.id}`, ctx.userId);
        receiveSignal('anubis', 'CRITICAL', { operation: op.id, threat: threat.threat });
        return results;
      }
    }

    results.push({ tag: 'ANUBIS', passed: true });
  }

  // DEKATEOTL: Fine-grained permissions
  if (op.securityTags.includes('DEKATEOTL')) {
    // Scope-based permission check
    const scopeHierarchy: Record<string, number> = {
      public: 0, user: 1, creator: 2, guardian: 3, admin: 4, system: 5,
    };
    // In production this would check actual user roles
    const userScope = ctx.userId ? 'user' : 'public';
    const required = scopeHierarchy[op.auth.scope] ?? 0;
    const actual = scopeHierarchy[userScope] ?? 0;

    if (actual < required) {
      results.push({ tag: 'DEKATEOTL', passed: false, detail: `Insufficient scope: need ${op.auth.scope}` });
      return results;
    }
    results.push({ tag: 'DEKATEOTL', passed: true });
  }

  // AZTEK_GODS: Hard enforcement
  if (op.securityTags.includes('AZTEK_GODS')) {
    // Check emergency mode
    if (emergencyMode === 'FULL_LOCKDOWN') {
      results.push({ tag: 'AZTEK_GODS', passed: false, detail: 'System in FULL_LOCKDOWN' });
      return results;
    }
    if (emergencyMode === 'READ_ONLY' && op.method !== 'GET') {
      results.push({ tag: 'AZTEK_GODS', passed: false, detail: 'System in READ_ONLY mode' });
      return results;
    }

    // Check EOCT level
    const eoct = getEOCTState();
    if (eoct.level === 'BLACK' || eoct.level === 'RED') {
      results.push({ tag: 'AZTEK_GODS', passed: false, detail: `EOCT level ${eoct.level}: operation blocked` });
      return results;
    }

    results.push({ tag: 'AZTEK_GODS', passed: true });
  }

  return results;
}

// ── Monitoring Pipeline ──
export function monitorCall(
  op: TamvaiOperation,
  ctx: RuntimeContext,
  result: RuntimeResult
): string[] {
  const events: string[] = [];

  if (op.monitoringTags.includes('HORUS')) {
    log(
      result.success ? 'info' : 'warn',
      'TAMVAI:Horus',
      `${op.method} ${op.path} → ${result.statusCode}`,
      { operationId: op.id, traceId: ctx.traceId, userId: ctx.userId }
    );
    recordMetric(`tamvai_${op.domain.toLowerCase()}_calls`, 1, 'count', {
      operation: op.id,
      status: String(result.statusCode),
    });
    events.push('HORUS:logged');
  }

  if (op.monitoringTags.includes('RADAR_QUETZALCOATL')) {
    recordMetric('tamvai_xr_ops', 1, 'count', { operation: op.id });
    events.push('RADAR_QUETZALCOATL:recorded');
  }

  if (op.monitoringTags.includes('RADAR_OJO_DE_RA')) {
    if (!result.success) {
      receiveSignal('radar', 'WARNING', {
        radar: 'ojo_de_ra',
        operation: op.id,
        statusCode: result.statusCode,
      });
      events.push('RADAR_OJO_DE_RA:alert');
    }
    events.push('RADAR_OJO_DE_RA:scanned');
  }

  if (op.monitoringTags.includes('RADAR_GEMELOS_MOS')) {
    recordMetric('tamvai_economy_ops', 1, 'count', { operation: op.id });
    events.push('RADAR_GEMELOS_MOS:recorded');
  }

  return events;
}

// ── Audit Pipeline ──
export async function applyAudit(
  op: TamvaiOperation,
  ctx: RuntimeContext,
  input: Record<string, unknown> | undefined,
  resultStatus: 'success' | 'failure' | 'blocked'
): Promise<AuditEntry | undefined> {
  if (!op.audit.logPayload) return undefined;

  // Redact sensitive fields
  const redacted: Record<string, unknown> = {};
  if (input) {
    for (const [key, value] of Object.entries(input)) {
      if (op.audit.redactedFields.includes(key)) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = value;
      }
    }
  }

  const entry: AuditEntry = {
    operationId: op.id,
    userId: ctx.userId,
    timestamp: ctx.timestamp,
    traceId: ctx.traceId,
    inputRedacted: redacted,
    result: resultStatus,
    emergencyPlan: op.audit.emergencyPlan,
  };

  // Anchor critical operations in BookPI
  if (op.audit.emergencyPlan !== 'NONE' && ctx.userId) {
    try {
      await anchorEvent(
        'SYSTEM_EVENT',
        ctx.userId,
        {
          operationId: op.id,
          domain: op.domain,
          result: resultStatus,
          traceId: ctx.traceId,
          emergencyPlan: op.audit.emergencyPlan,
        },
        `TAMVAI_AUDIT_${op.domain}`
      );
    } catch (e) {
      log('error', 'TAMVAI:Audit', `BookPI anchor failed for ${op.id}`, { error: String(e) });
    }
  }

  return entry;
}

// ── Unified Execution ──
export async function executeOperation(
  op: TamvaiOperation,
  ctx: RuntimeContext,
  input?: Record<string, unknown>,
  handler?: (input?: Record<string, unknown>) => Promise<unknown>
): Promise<RuntimeResult> {
  const endTrace = startTrace(`tamvai_${op.id}`);

  // 1. Security
  const securityChecks = await applySecurity(op, ctx, input);
  const blocked = securityChecks.find(c => !c.passed);

  if (blocked) {
    const result: RuntimeResult = {
      success: false,
      statusCode: blocked.tag === 'ANUBIS' && blocked.detail?.includes('Rate limit') ? 429
        : blocked.tag === 'ANUBIS' && blocked.detail?.includes('Authentication') ? 401
        : 403,
      error: blocked.detail,
      traceId: ctx.traceId,
      securityChecks,
      monitoringEvents: [],
    };
    result.monitoringEvents = monitorCall(op, ctx, result);
    result.auditLog = await applyAudit(op, ctx, input, 'blocked');
    endTrace();
    return result;
  }

  // 2. Sanitize input
  if (input) {
    for (const [key, value] of Object.entries(input)) {
      if (typeof value === 'string') {
        (input as Record<string, unknown>)[key] = sanitizeInput(value);
      }
    }
  }

  // 3. Execute handler
  let data: unknown;
  let success = true;
  let statusCode = 200;

  try {
    if (handler) {
      data = await handler(input);
    } else {
      data = { message: `${op.id} executed (no handler bound)` };
    }
  } catch (e) {
    success = false;
    statusCode = 500;
    data = { error: String(e) };
    log('error', 'TAMVAI:Runtime', `Handler error for ${op.id}`, { error: String(e) });
  }

  // 4. Build result
  const result: RuntimeResult = {
    success,
    statusCode,
    data,
    traceId: ctx.traceId,
    securityChecks,
    monitoringEvents: [],
  };

  // 5. Monitor
  result.monitoringEvents = monitorCall(op, ctx, result);

  // 6. Audit
  result.auditLog = await applyAudit(op, ctx, input, success ? 'success' : 'failure');

  endTrace();
  return result;
}
