import { CognitiveSignal } from "../types/cognition.types";
import { CognitiveState } from "../types/state.types";

export class StateSynthesizer {
  synthesize(
    prev: CognitiveState,
    signals: CognitiveSignal[],
  ): CognitiveState {
    let risk = prev.risk;
    let load = prev.load;

    for (const s of signals) {
      if (s.domain === "security") {
        risk = Math.min(1, risk + s.intensity * 0.4);
      }
      load = Math.min(1, load + s.intensity * 0.2);
    }

    return {
      ...prev,
      risk,
      load,
      coherence: Math.max(0, 1 - load),
      lastUpdate: Date.now(),
    };
  }
}
