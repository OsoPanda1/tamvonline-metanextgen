import { CognitiveIntent } from "./intent.types";
import { CognitiveState } from "./state.types";

export interface ConstitutionalVerdict {
  allowed: boolean;
  requireHuman: boolean;
  dampening?: number;
  reason: string;
}

export interface ConstitutionalRule {
  id: string;
  description: string;
  evaluate(
    state: CognitiveState,
    intent: CognitiveIntent,
  ): boolean;
}
