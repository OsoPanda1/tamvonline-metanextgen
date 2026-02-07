import { CognitiveIntent } from "@/cognition/types/intent.types";

export class GuardianiaEngine {
  vet(intent: CognitiveIntent): boolean {
    if (intent.reversibility === "hard" && intent.ethicalCost > 0.7) {
      return false;
    }
    return true;
  }
}
