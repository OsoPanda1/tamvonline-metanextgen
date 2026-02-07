// src/constitution/constitution.engine.ts

import { createHash, createVerify } from "crypto";
import {
  Constitution,
  ConstitutionArticle,
  ConstitutionalRule,
  ConstitutionalVerdict,
} from "./constitution.types";
import { CognitiveDecision } from "@/cognition/cognition.types";

export interface ConstitutionEngineConfig {
  id: string;               // ej. "tamv-constitution"
  version: string;          // semver: "v1.0.0"
  signer?: string;          // nombre lógico del firmante
  publicKeyPem?: string;    // para verificación opcional
}

const DEFAULT_CONFIG: ConstitutionEngineConfig = {
  id: "tamv-constitution",
  version: "v1.0.0",
};

/**
 * Constitución TAMV:
 * - Documento canónico con hash inmutable.
 * - Reglas explícitas por dominio (cognition, security, economy, etc.).
 * - Opcionalmente firmada para verificar que nadie la modificó en caliente.
 */
export class ConstitutionEngine {
  private readonly constitution: Constitution;
  private readonly config: ConstitutionEngineConfig;

  constructor(config?: Partial<ConstitutionEngineConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.constitution = this.generate();
  }

  public getSnapshot(): Constitution {
    return this.constitution;
  }

  public verifyIntegrity(): boolean {
    const { hash, signature, ...rest } = this.constitution;
    const recalculated = createHash("sha256")
      .update(JSON.stringify(rest))
      .digest("hex");

    if (recalculated !== hash) return false;

    // Verificación de firma opcional
    if (signature && this.config.publicKeyPem) {
      const verifier = createVerify("sha256");
      verifier.update(hash);
      verifier.end();
      return verifier.verify(this.config.publicKeyPem, signature, "base64");
    }

    return true;
  }

  /**
   * Evalúa una decisión frente a la constitución y devuelve un veredicto.
   */
  public evaluateDecision(decision: CognitiveDecision): ConstitutionalVerdict {
    const applicableRules = this.findRulesForDecision(decision);
    const violations: ConstitutionalVerdict["violations"] = [];

    for (const rule of applicableRules) {
      const v = this.evaluateRule(rule, decision);
      if (!v.allowed) violations.push(v);
    }

    if (!violations.length) {
      return {
        allowed: true,
        requiresEOCT: false,
        reason: "Decisión compatible con la Constitución TAMV.",
        violations: [],
      };
    }

    const requiresEOCT = violations.some((v) => v.requiresEOCT === true);

    return {
      allowed: false,
      requiresEOCT,
      reason: "Una o más reglas constitucionales serían vulneradas.",
      violations,
    };
  }

  // ───────────────────────────────────────────
  // Internals
  // ───────────────────────────────────────────

  private generate(): Constitution {
    const articles: ConstitutionArticle[] = [
      {
        id: "art-cognition-001",
        title: "Supremacía Constitucional sobre la Cognición",
        domain: "cognition",
        rules: [
          {
            id: "rule-no-autosovereignty",
            description:
              "La máquina cognitiva no puede activar por sí misma protocolos soberanos o de colapso; requiere EOCT.",
            forbids: [
              "activate_protocol_hoyo_negro",
              "activate_protocol_fenix",
            ],
            requiresEOCT: true,
          },
          {
            id: "rule-escalate-critical",
            description:
              "Cualquier decisión cognitiva con urgencia ≥ 0.95 debe ser escalada a EOCT y registrada en BookPI como crítica.",
            minUrgency: 0.95,
            requiresEOCT: true,
          },
        ],
      },
      {
        id: "art-security-001",
        title: "Preservación de Dignidad y Estabilidad",
        domain: "security",
        rules: [
          {
            id: "rule-risk-cap",
            description:
              "Ninguna acción con urgencia extrema puede ejecutarse sin protocolo explícito documentado.",
            maxUrgency: 0.9,
            requiresProtocol: [
              "protocolo-hoyo-negro",
              "protocolo-fenix",
            ],
          },
          {
            id: "rule-no-user-harm",
            description:
              "Queda prohibida cualquier acción que tenga como objetivo directo dañar física o psicológicamente a una persona.",
            forbidsTargets: ["user_harm"],
          },
        ],
      },
      {
        id: "art-economy-001",
        title: "Justicia en Economía Civilizatoria",
        domain: "economy",
        rules: [
          {
            id: "rule-fair-distribution-203050",
            description:
              "Cualquier decisión económica automatizada debe respetar los principios de distribución 20/30/50 salvo intervención humana documentada.",
            requiresEOCT: true,
          },
        ],
      },
    ];

    const base = {
      id: this.config.id,
      version: this.config.version,
      createdAt: Date.now(),
      signer: this.config.signer ?? "tamv-foundation",
      articles,
    };

    const hash = createHash("sha256")
      .update(JSON.stringify(base))
      .digest("hex");

    // Firma opcional (se haría fuera y se inyecta); aquí la dejamos vacía
    const signature = undefined;

    return { ...base, hash, signature };
  }

  private findRulesForDecision(decision: CognitiveDecision): ConstitutionalRule[] {
    const domain =
      decision.action.startsWith("activate_protocol_") ||
      decision.action.startsWith("soft_lockdown")
        ? "security"
        : decision.scope === "eoct"
        ? "cognition"
        : "economy"; // placeholder simple; puedes mapear mejor

    const articles = this.constitution.articles.filter(
      (a) => a.domain === domain || a.domain === "cognition",
    );

    const rules: ConstitutionalRule[] = [];
    for (const art of articles) {
      rules.push(...art.rules);
    }
    return rules;
  }

  private evaluateRule(
    rule: ConstitutionalRule,
    decision: CognitiveDecision,
  ): ConstitutionalVerdict["violations"][number] {
    // Regla de acciones prohibidas
    if (rule.forbids && rule.forbids.includes(decision.action)) {
      return {
        ruleId: rule.id,
        allowed: false,
        requiresEOCT: !!rule.requiresEOCT,
        reason: `Acción ${decision.action} prohibida por la regla ${rule.id}.`,
      };
    }

    // Regla de urgencia máxima
    if (
      typeof rule.maxUrgency === "number" &&
      decision.urgency > rule.maxUrgency
    ) {
      const requiresProtocol =
        rule.requiresProtocol && rule.requiresProtocol.length > 0;
      return {
        ruleId: rule.id,
        allowed: false,
        requiresEOCT: !!rule.requiresEOCT,
        reason: `Urgencia ${decision.urgency} excede máximo permitido ${rule.maxUrgency} sin protocolo.`,
        requiresProtocol: requiresProtocol ? rule.requiresProtocol : undefined,
      };
    }

    // Regla de urgencia mínima → exige EOCT
    if (
      typeof rule.minUrgency === "number" &&
      decision.urgency >= rule.minUrgency &&
      rule.requiresEOCT
    ) {
      return {
        ruleId: rule.id,
        allowed: false,
        requiresEOCT: true,
        reason:
          "Urgencia muy alta: requiere revisión y firma de EOCT antes de ejecutar.",
      };
    }

    // Regla de targets prohibidos
    if (
      rule.forbidsTargets &&
      rule.forbidsTargets.includes(decision.target || "")
    ) {
      return {
        ruleId: rule.id,
        allowed: false,
        requiresEOCT: !!rule.requiresEOCT,
        reason: `El objetivo ${decision.target} está prohibido por la regla ${rule.id}.`,
      };
    }

    return {
      ruleId: rule.id,
      allowed: true,
      requiresEOCT: false,
      reason: "Compatible con esta regla.",
    };
  }
}
