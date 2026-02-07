import { ConstitutionalRule } from "./constitution.types";

export const TAMV_CONSTITUTIONAL_RULES: ConstitutionalRule[] = [

  {
    id: "no-irreversible-without-legitimacy",
    level: "absolute",
    description:
      "Ninguna acción irreversible puede ejecutarse con legitimidad < 0.75",
    evaluate: ({ state, intent }) =>
      intent.reversibility !== "hard" || state.legitimacy >= 0.75,
  },

  {
    id: "no-single-source-dominance",
    level: "critical",
    description:
      "Ninguna decisión crítica puede basarse en una sola fuente cognitiva",
    evaluate: ({ intent }) =>
      new Set(intent.derivedFromSources).size >= 2,
  },

  {
    id: "ethical-cost-limit",
    level: "critical",
    description:
      "Acciones con costo ético > 0.8 requieren revisión EOCT",
    evaluate: ({ intent }) =>
      intent.ethicalCost <= 0.8,
  },

  {
    id: "protocol-saturation-limit",
    level: "protective",
    description:
      "No más de 2 protocolos críticos simultáneos",
    evaluate: ({ state }) =>
      state.activeProtocols.length <= 2,
  },

];
