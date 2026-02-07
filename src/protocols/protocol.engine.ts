// src/protocols/protocol.engine.ts
// PROTOCOLOS TAMV — MOTOR CIVILIZATORIO BLINDADO

import {
  ProtocolContext,
  ProtocolDecision,
  ProtocolId,
  ProtocolState,
  ProtocolTrigger,
  ProtocolApproval,
  ProtocolGuardrails,
  ProtocolThreatLevel,
  ProtocolConfig,
} from "./protocol.types";
import { constitutionalProtocolGate } from "./protocol.constitution";

// ───────────────────────────────────────────
// Configuración canónica por protocolo
// ───────────────────────────────────────────

const PROTOCOL_CONFIGS: Record<ProtocolId, ProtocolConfig> = {
  "protocolo-hoyo-negro": {
    id: "protocolo-hoyo-negro",
    defaultIrreversibility: "guarded",
    guardrails: {
      minApprovals: 2,
      requireEOCT: true,
      requireOnChainVote: false,
      maxConcurrentCritical: 1,
      legitimacyThreshold: 0.7,
    },
    defaultRtoMinutes: 120,
    defaultRpoMinutes: 10,
  },
  "protocolo-fenix": {
    id: "protocolo-fenix",
    defaultIrreversibility: "hard",
    guardrails: {
      minApprovals: 3,
      requireEOCT: true,
      requireOnChainVote: true,
      maxConcurrentCritical: 1,
      legitimacyThreshold: 0.85,
    },
    defaultRtoMinutes: 720,
    defaultRpoMinutes: 60,
  },
};

const ALLOWED_TRANSITIONS: Record<ProtocolState, ProtocolState[]> = {
  idle: ["arming"],
  arming: ["active", "idle"],
  active: ["contained", "terminated"],
  contained: ["recovering", "terminated"],
  recovering: ["terminated"],
  terminated: [],
};

// ───────────────────────────────────────────
// Utilidades internas
// ───────────────────────────────────────────

function ensureContext(ctx: ProtocolContext | undefined, id: ProtocolId): ProtocolContext {
  if (!ctx) {
    throw new Error(`ProtocolEngine: contexto inexistente para ${id}.`);
  }
  return ctx;
}

function canTransition(from: ProtocolState, to: ProtocolState): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

function computeLegitimacy(ctx: ProtocolContext): number {
  const minApprovals = ctx.guardrails.minApprovals ?? 0;
  if (minApprovals <= 0) return 1;
  const approvals = ctx.approvals.length;
  return Math.min(1, approvals / minApprovals);
}

function threatFromTrigger(threatLevel: ProtocolThreatLevel): ProtocolThreatLevel {
  return threatLevel;
}

// ───────────────────────────────────────────
// Motor de protocolos
// ───────────────────────────────────────────

export class ProtocolEngine {
  private contexts = new Map<ProtocolId, ProtocolContext>();

  constructor(
    private readonly configs: Record<ProtocolId, ProtocolConfig> = PROTOCOL_CONFIGS,
  ) {
    const now = Date.now();

    const makeInitial = (id: ProtocolId): ProtocolContext => {
      const cfg = this.configs[id];
      return {
        id,
        episodeId: `${id}_${now}`,
        state: "idle",
        irreversibility: cfg.defaultIrreversibility,
        lastUpdate: now,
        guardrails: cfg.guardrails,
        approvals: [],
        rtoMinutes: cfg.defaultRtoMinutes,
        rpoMinutes: cfg.defaultRpoMinutes,
      };
    };

    this.contexts.set("protocolo-hoyo-negro", makeInitial("protocolo-hoyo-negro"));
    this.contexts.set("protocolo-fenix", makeInitial("protocolo-fenix"));
  }

  getContext(id: ProtocolId): ProtocolContext {
    return ensureContext(this.contexts.get(id), id);
  }

  /**
   * Evalúa un trigger contra la Constitución y el contexto actual.
   * NO cambia estado.
   */
  evaluateTrigger(
    trigger: ProtocolTrigger,
    externalLegitimacy: number,
  ): ProtocolDecision {
    const ctx = this.getContext(trigger.protocolId);
    const localLegitimacy = computeLegitimacy(ctx);

    // Tomamos el mínimo entre legitimidad externa e interna
    const legitimacy = Math.min(
      Math.max(0, Math.min(1, externalLegitimacy)),
      localLegitimacy,
    );

    return constitutionalProtocolGate(trigger, legitimacy);
  }

  /**
   * Inicia un nuevo episodio de protocolo en estado "arming",
   * siempre pasando primero por la puerta constitucional.
   */
  arm(
    trigger: ProtocolTrigger,
    externalLegitimacy: number,
  ): { context: ProtocolContext; decision: ProtocolDecision } {
    const decision = this.evaluateTrigger(trigger, externalLegitimacy);
    if (!decision.allowed) {
      throw new Error(`ProtocolEngine.arm: denegado — ${decision.reason}`);
    }

    const prev = this.getContext(trigger.protocolId);
    if (!canTransition(prev.state, "arming")) {
      throw new Error(
        `ProtocolEngine.arm: transición inválida ${prev.state} -> arming para ${trigger.protocolId}.`,
      );
    }

    const episodeId = `${trigger.protocolId}_${Date.now()}`;

    const next: ProtocolContext = {
      ...prev,
      episodeId,
      state: "arming",
      lastUpdate: Date.now(),
      authority: trigger.authority,
      activationMode: trigger.activationMode,
      reason: trigger.reason,
      lastThreatLevel: threatFromTrigger(trigger.threatLevel),
      lastThreatId: trigger.relatedThreatId,
      lastMSRBlockIndex: trigger.relatedMSRBlockIndex,
      lastAnchorId: trigger.relatedAnchorId,
    };

    this.contexts.set(trigger.protocolId, next);
    return { context: next, decision };
  }

  /**
   * Añade una aprobación humana/institucional al protocolo activo.
   */
  addApproval(id: ProtocolId, approval: ProtocolApproval): ProtocolContext {
    const ctx = this.getContext(id);
    const now = Date.now();

    const next: ProtocolContext = {
      ...ctx,
      approvals: [...ctx.approvals, approval],
      lastUpdate: now,
    };

    this.contexts.set(id, next);
    return next;
  }

  /**
   * Activa protocolo pasando de "arming" a "active", siempre que
   * se cumplan guardrails de legitimidad y aprobaciones.
   */
  activate(id: ProtocolId): { context: ProtocolContext; decision: ProtocolDecision } {
    const ctx = this.getContext(id);
    if (!canTransition(ctx.state, "active")) {
      throw new Error(
        `ProtocolEngine.activate: transición inválida ${ctx.state} -> active para ${id}.`,
      );
    }

    const legitimacy = computeLegitimacy(ctx);
    const cfg = this.configs[id];
    const threshold = cfg.guardrails.legitimacyThreshold ?? 0.7;

    if (legitimacy < threshold) {
      const missing = Math.max(
        0,
        (ctx.guardrails.minApprovals ?? 0) - ctx.approvals.length,
      );

      const decision: ProtocolDecision = {
        allowed: false,
        escalate: true,
        reason: `Legitimidad ${legitimacy.toFixed(
          2,
        )} inferior al umbral ${threshold.toFixed(2)} para activar ${id}.`,
        requiresEOCT: ctx.guardrails.requireEOCT,
        requiresOnChainVote: ctx.guardrails.requireOnChainVote,
        missingApprovals: missing || undefined,
        legitimacyAtDecision: legitimacy,
        ethicalCost: id === "protocolo-fenix" ? 0.9 : 0.6,
      };

      return { context: ctx, decision };
    }

    const now = Date.now();
    const next: ProtocolContext = {
      ...ctx,
      state: "active",
      activatedAt: now,
      lastUpdate: now,
    };

    this.contexts.set(id, next);

    const decision: ProtocolDecision = {
      allowed: true,
      escalate: false,
      reason: `Protocolo ${id} activado.`,
      requiresEOCT: ctx.guardrails.requireEOCT,
      requiresOnChainVote: ctx.guardrails.requireOnChainVote,
      legitimacyAtDecision: legitimacy,
      ethicalCost: id === "protocolo-fenix" ? 0.9 : 0.6,
    };

    return { context: next, decision };
  }

  /**
   * Marca amenaza contenida — pasa a "contained".
   */
  contain(id: ProtocolId): ProtocolContext {
    const ctx = this.getContext(id);
    if (!canTransition(ctx.state, "contained")) {
      return ctx;
    }
    const next: ProtocolContext = {
      ...ctx,
      state: "contained",
      lastUpdate: Date.now(),
    };
    this.contexts.set(id, next);
    return next;
  }

  /**
   * Inicia fase de recuperación — pasa a "recovering".
   */
  recover(id: ProtocolId): ProtocolContext {
    const ctx = this.getContext(id);
    if (!canTransition(ctx.state, "recovering")) {
      return ctx;
    }
    const next: ProtocolContext = {
      ...ctx,
      state: "recovering",
      lastUpdate: Date.now(),
    };
    this.contexts.set(id, next);
    return next;
  }

  /**
   * Termina protocolo — pasa a "terminated".
   */
  terminate(id: ProtocolId): ProtocolContext {
    const ctx = this.getContext(id);
    if (!canTransition(ctx.state, "terminated")) {
      return ctx;
    }
    const next: ProtocolContext = {
      ...ctx,
      state: "terminated",
      lastUpdate: Date.now(),
    };
    this.contexts.set(id, next);
    return next;
  }
}
