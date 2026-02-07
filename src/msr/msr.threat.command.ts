// src/msr/msr.threat.command.ts

import { MSRThreatEngine } from "./msr.threat.engine";
import { MSRThreatSignal, MSRThreatContext } from "./msr.threat.types";
import { MSRThreatToMSRAdapter } from "./msr.threat.msr.adapter";
import { MSRThreatToBookPIAdapter } from "./msr.threat.bookpi.adapter";
import { MSRThreatEOCTAdapter } from "./msr.threat.eoct.adapter";

export class MSRThreatCommand {
  constructor(
    private readonly engine: MSRThreatEngine,
    private readonly msr: MSRThreatToMSRAdapter,
    private readonly bookpi: MSRThreatToBookPIAdapter,
    private readonly eoct: MSRThreatEOCTAdapter,
  ) {}

  /**
   * Ingesta completa de una señal:
   *  - Actualiza contexto de amenaza.
   *  - Registra señal en MSR.
   *  - Ancla en BookPI (señal + contexto).
   *  - Escala a EOCT si corresponde.
   */
  async ingest(signal: MSRThreatSignal): Promise<MSRThreatContext> {
    // 1) Actualizar motor de amenaza
    const ctx = this.engine.register(signal);

    // 2) Registrar en MSR y enriquecer señal
    let enrichedSignal = signal;
    try {
      const { block, enrichedSignal: s } = this.msr.recordThreat(signal);
      enrichedSignal = s;
      // opcional: marcar que ya se ancló en MSR
      this.engine.markAnchored({ msr: true });
    } catch {
      // si MSR falla, igual continuamos con BookPI/EOCT
    }

    // 3) Anclar señal + contexto en BookPI
    try {
      this.bookpi.anchorSignal(enrichedSignal);
      this.bookpi.anchorContext(this.engine.getContext());
      this.engine.markAnchored({ bookpi: true });
    } catch {
      // fallo de auditoría no debe tumbar el flujo de emergencia
    }

    // 4) Escalamiento EOCT si procede
    if (ctx.escalationRequired && !ctx.eoctNotified) {
      await this.eoct.escalate(this.engine.getContext());
      this.engine.markEOCTNotified();
    }

    return this.engine.getContext();
  }
}
