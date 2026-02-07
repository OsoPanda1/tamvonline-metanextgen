// src/protocols/protocol.command.ts
// COMANDO CENTRAL DE PROTOCOLOS · ORQUESTADOR BLINDADO

import { ProtocolEngine } from "./protocol.engine";
import {
  ProtocolDecision,
  ProtocolTrigger,
  ProtocolContext,
} from "./protocol.types";
import { ProtocolToMSRAdapter } from "./protocol.msr.adapter";
import { ProtocolToBookPIAdapter } from "./protocol.bookpi.adapter";

export interface ProtocolCommandResult {
  decision: ProtocolDecision;
  context?: ProtocolContext;
}

export class ProtocolCommand {
  constructor(
    private readonly engine: ProtocolEngine,
    private readonly msr: ProtocolToMSRAdapter,
    private readonly bookpi: ProtocolToBookPIAdapter,
  ) {}

  /**
   * Orquesta la ejecución de un trigger de protocolo:
   * 1. Evalúa constitucionalidad.
   * 2. Ancla en MSR y BookPI el trigger.
   * 3. Si es permitido, arma+activa protocolo.
   * 4. Ancla estado resultante.
   */
  execute(trigger: ProtocolTrigger, legitimacy: number): ProtocolCommandResult {
    const decision = this.engine.evaluateTrigger(trigger, legitimacy);

    // SIEMPRE anclamos el trigger, aunque sea rechazado: queda el intento.
    const msrTriggerResult = this.msr.recordTrigger(trigger);
    this.bookpi.anchorTrigger(trigger);

    // Si la Constitución lo rechaza, devolvemos solo el veredicto.
    if (!decision.allowed) {
      return {
        decision: {
          ...decision,
          // enriquecemos con referencias MSR cuando existan
          relatedMSRBlockIndex: msrTriggerResult.index,
        },
      };
    }

    // Protocolo armado+activado mediante el motor (que ya respeta guardrails).
    const { context, decision: activationDecision } = this.engine.activate(
      trigger.protocolId,
    );

    // Anclamos el nuevo estado en MSR y BookPI.
    const msrStateResult = this.msr.recordState(context);
    this.bookpi.anchorState(context);

    // Devolvemos decisión final fusionando evaluación inicial y activación.
    const finalDecision: ProtocolDecision = {
      ...decision,
      allowed: activationDecision.allowed,
      escalate: activationDecision.escalate ?? decision.escalate,
      reason: activationDecision.reason || decision.reason,
      requiresEOCT:
        activationDecision.requiresEOCT ?? decision.requiresEOCT,
      requiresOnChainVote:
        activationDecision.requiresOnChainVote ?? decision.requiresOnChainVote,
      ethicalCost: activationDecision.ethicalCost ?? decision.ethicalCost,
      legitimacyAtDecision:
        activationDecision.legitimacyAtDecision ??
        decision.legitimacyAtDecision,
      relatedMSRBlockIndex: msrStateResult.index,
    };

    return {
      decision: finalDecision,
      context,
    };
  }
}
