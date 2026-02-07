// src/protocols/protocol.bookpi.adapter.ts
// ADAPTADOR PROTOCOLOS ↔ BOOKPI · LIBRO CIVILIZATORIO BLINDADO

import { BookPI, BookPIEventPayload } from "@/core/bookpi";
import {
  ProtocolContext,
  ProtocolTrigger,
  ProtocolId,
  ProtocolState,
} from "./protocol.types";

type BookPILevel = "low" | "normal" | "high" | "critical";

function levelForTrigger(protocolId: ProtocolId): BookPILevel {
  return protocolId === "protocolo-fenix" ? "critical" : "high";
}

function levelForState(state: ProtocolState, protocolId: ProtocolId): BookPILevel {
  if (state === "active" || state === "terminated") return "critical";
  if (protocolId === "protocolo-fenix" && state === "arming") return "high";
  return "normal";
}

function shouldLedgerTrigger(protocolId: ProtocolId): boolean {
  return protocolId === "protocolo-fenix";
}

function shouldLedgerState(state: ProtocolState, protocolId: ProtocolId): boolean {
  if (protocolId === "protocolo-fenix") {
    return state === "active" || state === "terminated";
  }
  return state === "terminated";
}

/**
 * Adaptador entre motor de protocolos y BookPI.
 * - Todos los disparadores y estados quedan anclados de forma explicable.
 * - Se minimiza el payload para no volcar estructuras gigantes sin control.
 */
export class ProtocolToBookPIAdapter {
  constructor(private readonly bookpi: BookPI) {}

  anchorTrigger(trigger: ProtocolTrigger) {
    const payload: BookPIEventPayload = {
      domain: "protocols",
      type: "protocol_trigger",
      level: levelForTrigger(trigger.protocolId),
      data: {
        protocolId: trigger.protocolId,
        authority: trigger.authority,
        reason: trigger.reason,
        threatLevel: trigger.threatLevel,
        impactDomains: trigger.impactDomains,
        activationMode: trigger.activationMode,
        relatedThreatId: trigger.relatedThreatId ?? null,
        relatedMSRBlockIndex: trigger.relatedMSRBlockIndex ?? null,
        relatedAnchorId: trigger.relatedAnchorId ?? null,
        ts: trigger.ts,
      },
      candidateForLedger: shouldLedgerTrigger(trigger.protocolId),
    };

    this.bookpi.anchorEvent(payload);
  }

  anchorState(context: ProtocolContext) {
    const level = levelForState(context.state, context.id);

    const payload: BookPIEventPayload = {
      domain: "protocols",
      type: "protocol_state_change",
      level,
      data: {
        protocolId: context.id,
        episodeId: context.episodeId,
        state: context.state,
        irreversibility: context.irreversibility,
        authority: context.authority ?? null,
        activationMode: context.activationMode ?? null,
        reason: context.reason ?? null,
        // sólo metadatos de aprobaciones, no firmas completas
        approvals: context.approvals.map((a) => ({
          approverId: a.approverId,
          role: a.role,
          approvedAt: a.approvedAt,
        })),
        guardrails: context.guardrails,
        rtoMinutes: context.rtoMinutes ?? null,
        rpoMinutes: context.rpoMinutes ?? null,
        lastThreatLevel: context.lastThreatLevel ?? null,
        lastThreatId: context.lastThreatId ?? null,
        lastMSRBlockIndex: context.lastMSRBlockIndex ?? null,
        lastAnchorId: context.lastAnchorId ?? null,
        activatedAt: context.activatedAt ?? null,
        lastUpdate: context.lastUpdate,
      },
      candidateForLedger: shouldLedgerState(context.state, context.id),
    };

    this.bookpi.anchorEvent(payload);
  }

  /**
   * Atajo para anclar trigger y estado inicial (arming) juntos
   * cuando se inicia un nuevo episodio.
   */
  anchorTriggerAndState(trigger: ProtocolTrigger, context: ProtocolContext) {
    this.anchorTrigger(trigger);
    this.anchorState(context);
  }
}
