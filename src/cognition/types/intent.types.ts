export type CognitiveActionScope =
  | "local"
  | "system"
  | "user"
  | "eoct";

export type CognitiveDecisionReversibility =
  | "soft"
  | "guarded"
  | "hard";

export interface CognitiveIntent {
  id: string;
  action: string;
  scope: CognitiveActionScope;
  reversibility: CognitiveDecisionReversibility;
  urgency: number;     // 0..1
  confidence: number;  // 0..1
  ethicalCost: number; // 0..1
  derivedFrom: string[];
}
