export type CognitiveMood =
  | "serene"
  | "curious"
  | "alert"
  | "protective"
  | "ritual"
  | "chaotic";

export type CognitiveSource =
  | "xr"
  | "audio"
  | "social"
  | "ledger"
  | "system"
  | "radar"
  | "guardiania"
  | "eoct"
  | "human";

export type CognitiveDomain =
  | "user_experience"
  | "security"
  | "economy"
  | "governance"
  | "infrastructure"
  | "ritual";

export type CognitiveSignalSeverity =
  | "info"
  | "notice"
  | "warning"
  | "critical";

export type CognitiveSignalNature =
  | "observation"
  | "evaluation"
  | "directive";

export interface CognitiveSignal {
  id: string;
  source: CognitiveSource;
  domain: CognitiveDomain;
  nature: CognitiveSignalNature;
  type: string;
  severity: CognitiveSignalSeverity;
  intensity: number; // 0..1
  ts: number;
  payload?: Record<string, unknown>;

  relatedAnchorId?: string;
  relatedLedgerTxId?: string;
}
