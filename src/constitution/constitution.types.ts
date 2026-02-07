export type ConstitutionalLevel =
  | "absolute"     // nunca puede violarse
  | "critical"     // solo con EOCT + MSR
  | "protective";  // puede degradar acciones

export interface ConstitutionalRule {
  id: string;
  level: ConstitutionalLevel;
  description: string;

  // evaluación pura (sin side effects)
  evaluate(input: {
    state: any;
    intent: any;
  }): boolean;
}

export interface TAMVConstitution {
  id: string;
  version: string;
  createdAt: number;
  createdBy: "machine" | "human" | "hybrid";

  principles: string[];
  rules: ConstitutionalRule[];

  hash: string; // para MSR
}
