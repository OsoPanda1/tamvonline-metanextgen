// src/protocols/protocol.lifecycle.ts
// LIFECYCLE BLINDADO — PROTOCOLOS TAMV
// FSM + monitoreo + ejecución + reportes + registros MSR/BookPI + EOCT
// Enfoque: do-no-harm, trazabilidad, autoridad humana explícita.

import {
  ProtocolContext,
  ProtocolDecision,
  ProtocolState,
  ProtocolTrigger,
  ProtocolAuthority,
  ProtocolApproval,
  ProtocolThreatLevel,
} from "./protocol.types";

/* ============================
 * ERRORES DUROS (NO SILENCIOS)
 * ============================ */
export class ProtocolViolationError extends Error {
  constructor(message: string) {
    super(`[PROTOCOL VIOLATION] ${message}`);
  }
}

export class ProtocolEthicsError extends Error {
  constructor(message: string) {
    super(`[PROTOCOL ETHICS] ${message}`);
  }
}

/* ============================
 * TRANSICIONES PERMITIDAS (FSM)
 * ============================ */
const ALLOWED_TRANSITIONS: Record<ProtocolState, ProtocolState[]> = {
  idle: ["arming"],
  arming: ["active", "terminated"],
  active: ["contained", "recovering"],
  contained: ["recovering", "terminated"],
  recovering: ["terminated"],
  terminated: [],
};

function assertTransition(from: ProtocolState, to: ProtocolState) {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new ProtocolViolationError(`Invalid transition ${from} → ${to}`);
  }
}

/* ============================
 * CONTRATOS EXTERNOS (PORTS)
 * ============================ */
export interface MSRPort {
  append(payload: {
    domain: "protocols";
    type: string;
    data: unknown;
  }): { blockIndex: number; hash: string };
}

export interface BookPIPort {
  anchorEvent(event: {
    domain: string;
    type: string;
    level: "medium" | "high" | "critical";
    data: unknown;
    candidateForLedger?: boolean;
  }): { anchorId: string };
}

export interface EOCTPort {
  notify(event: {
    protocolId: string;
    state: ProtocolState;
    reason: string;
  }): void;
}

/* ============================
 * MONITOR Y REPORTES
 * ============================ */
export interface ProtocolMonitorSnapshot {
  protocolId: string;
  state: ProtocolState;
  approvals: number;
  lastUpdate: number;
  threatLevel?: ProtocolThreatLevel;
  msrBlockIndex?: number;
  anchorId?: string;
}

export interface ProtocolReport {
  protocolId: string;
  timeline: Array<{
    state: ProtocolState;
    ts: number;
    reason?: string;
  }>;
  approvals: ProtocolApproval[];
  finalState: ProtocolState;
  closedAt: number;
}

/* ============================
 * UTILIDADES ÉTICAS / LEGITIMIDAD
 * ============================ */
function computeLegitimacy(ctx: ProtocolContext): number {
  const min = ctx.guardrails.minApprovals ?? 0;
  if (min <= 0) return 1;
  const approvals = ctx.approvals.length;
  return Math.min(1, approvals / min);
}

function assertEthicalGuardrails(ctx: ProtocolContext, trigger: ProtocolTrigger) {
  // Do-no-harm básico: si el trigger declara impacto sobre personas vulnerables
  // y no hay autoridad suficiente o guardrails fuertes, se bloquea.
  if (trigger.impactDomains?.includes("human_life")) {
    const legitimacy = computeLegitimacy(ctx);
    const threshold = ctx.guardrails.legitimacyThreshold ?? 0.8;
    if (legitimacy < threshold) {
      throw new ProtocolEthicsError(
        `Insufficient legitimacy (${legitimacy.toFixed(
          2,
        )}) for high-impact domain "human_life"`,
      );
    }
  }
}

/* ============================
 * LIFECYCLE ENGINE
 * ============================ */
export class ProtocolLifecycle {
  private ctx: ProtocolContext;
  private readonly timeline: ProtocolReport["timeline"] = [];

  constructor(
    initialContext: ProtocolContext,
    private readonly msr: MSRPort,
    private readonly bookpi: BookPIPort,
    private readonly eoct: EOCTPort,
  ) {
    this.ctx = { ...initialContext };
    this.record(this.ctx.state, "protocol_initialized");
  }

  /* ==========
   * LECTURAS
   * ========== */
  getContext(): ProtocolContext {
    return { ...this.ctx };
  }

  snapshot(): ProtocolMonitorSnapshot {
    return {
      protocolId: this.ctx.id,
      state: this.ctx.state,
      approvals: this.ctx.approvals.length,
      lastUpdate: this.ctx.lastUpdate,
      threatLevel: this.ctx.lastThreatLevel,
      msrBlockIndex: this.ctx.lastMSRBlockIndex,
      anchorId: this.ctx.lastAnchorId,
    };
  }

  /* ============================
   * DECISIÓN PREVIA (GATE)
   * ============================ */
  evaluateTrigger(trigger: ProtocolTrigger): ProtocolDecision {
    const g = this.ctx.guardrails;

    // Autoridad EOCT obligatoria cuando así lo exijan los guardrails.
    if (g.requireEOCT && trigger.authority !== "eoct") {
      return {
        allowed: false,
        escalate: true,
        reason: "EOCT authority required by guardrails",
        requiresEOCT: true,
      };
    }

    // Mínimo de aprobaciones exigidas por guardrails.
    if (g.minApprovals && this.ctx.approvals.length < g.minApprovals) {
      return {
        allowed: false,
        escalate: false,
        reason: "Insufficient approvals for protocol trigger",
        missingApprovals: g.minApprovals - this.ctx.approvals.length,
      };
    }

    // Comprobación ética adicional (do-no-harm / alta sensibilidad humana).
    assertEthicalGuardrails(this.ctx, trigger);

    const legitimacy = computeLegitimacy(this.ctx);

    return {
      allowed: true,
      escalate: false,
      reason: "Trigger accepted under guardrails",
      requiresOnChainVote: g.requireOnChainVote,
      legitimacyAtDecision: legitimacy,
    };
  }

  /* ============================
   * TRANSICIÓN BLINDADA
   * ============================ */
  transition(
    next: ProtocolState,
    reason: string,
    authority: ProtocolAuthority,
  ): void {
    assertTransition(this.ctx.state, next);

    this.ctx = {
      ...this.ctx,
      state: next,
      authority,
      lastUpdate: Date.now(),
      reason,
    };

    this.record(next, reason);
    this.register(next, reason);
    this.notifyEOCTIfCritical(next, reason);
  }

  /* ============================
   * APROBACIONES
   * ============================ */
  addApproval(approval: ProtocolApproval): void {
    this.ctx.approvals = [...this.ctx.approvals, approval];
    this.ctx.lastUpdate = Date.now();
  }

  /* ============================
   * EJECUCIÓN (HOOK)
   * ============================ */
  async execute(executor: () => Promise<void>): Promise<void> {
    if (this.ctx.state !== "active") {
      throw new ProtocolViolationError(
        "Execution allowed only in active state",
      );
    }

    // No ejecutamos si no hay autoridad humana explícita.
    if (!this.ctx.authority) {
      throw new ProtocolEthicsError(
        "Execution requires explicit human / institutional authority",
      );
    }

    await executor();
  }

  /* ============================
   * REGISTROS MSR + BOOKPI
   * ============================ */
  private register(state: ProtocolState, reason: string) {
    const msrResult = this.msr.append({
      domain: "protocols",
      type: "protocol_state_transition",
      data: {
        protocolId: this.ctx.id,
        state,
        reason,
        ts: this.ctx.lastUpdate,
      },
    });

    const level: "medium" | "high" | "critical" =
      state === "active" || state === "terminated"
        ? "critical"
        : state === "arming"
          ? "high"
          : "medium";

    const anchor = this.bookpi.anchorEvent({
      domain: "protocols",
      type: "state_transition",
      level,
      data: {
        protocolId: this.ctx.id,
        state,
        reason,
        msrBlockIndex: msrResult.blockIndex,
        ts: this.ctx.lastUpdate,
      },
      candidateForLedger: state === "active" || state === "terminated",
    });

    this.ctx.lastMSRBlockIndex = msrResult.blockIndex;
    this.ctx.lastAnchorId = anchor.anchorId;
  }

  /* ============================
   * EOCT NOTIFY
   * ============================ */
  private notifyEOCTIfCritical(state: ProtocolState, reason: string) {
    if (state === "active" || state === "terminated") {
      this.eoct.notify({
        protocolId: this.ctx.id,
        state,
        reason,
      });
    }
  }

  /* ============================
   * TIMELINE
   * ============================ */
  private record(state: ProtocolState, reason?: string) {
    this.timeline.push({
      state,
      ts: Date.now(),
      reason,
    });
  }

  /* ============================
   * CIERRE Y REPORTE FINAL
   * ============================ */
  close(): ProtocolReport {
    if (this.ctx.state !== "terminated") {
      throw new ProtocolViolationError(
        "Protocol must be terminated before close",
      );
    }

    return {
      protocolId: this.ctx.id,
      timeline: [...this.timeline],
      approvals: [...this.ctx.approvals],
      finalState: this.ctx.state,
      closedAt: Date.now(),
    };
  }
}
