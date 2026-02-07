// src/constitution/constitution.publisher.ts

import { Constitution } from "./constitution.types";
import { BookPI } from "@/core/bookpi";

type PublishKind = "initial" | "update" | "rollback";

/**
 * ConstitutionPublisher
 * - Registra en BookPI cada publicación/actualización de la Constitución TAMV.
 * - Deja claro quién la promueve, desde qué versión y con qué motivo.
 * - Marca eventos candidatos a MSR/ledger para tener trilogía:
 *   código → constitución → auditoría inmutable.
 */
export class ConstitutionPublisher {
  constructor(private readonly bookpi: BookPI) {}

  async publish(options: {
    constitution: Constitution;
    kind: PublishKind;
    actorId: string;        // operador humano / EOCT / sistema
    reason: string;         // narrativa breve: por qué cambia
    previousVersion?: string;
  }) {
    const {
      constitution,
      kind,
      actorId,
      reason,
      previousVersion,
    } = options;

    // No incluimos el texto completo en raw si es gigante; se guarda hash y metadatos
    const payload = {
      constitutionId: constitution.id,
      version: constitution.version,
      hash: constitution.hash,
      signer: constitution.signer,
      createdAt: constitution.createdAt,
      kind,
      actorId,
      reason,
      previousVersion: previousVersion ?? null,
      articleCount: constitution.articles.length,
    };

    await this.bookpi.anchorEvent({
      domain: "constitution",
      type: "constitution_published",
      level: kind === "rollback" ? "critical" : "high",
      data: payload,
      candidateForLedger: true,
    });
  }
}
