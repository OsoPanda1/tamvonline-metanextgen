import { CognitiveSignal } from "../types/cognition.types";

export class SignalBus {
  private queue: CognitiveSignal[] = [];

  ingest(signal: CognitiveSignal) {
    this.queue.push(signal);
  }

  drain(): CognitiveSignal[] {
    const out = [...this.queue];
    this.queue.length = 0;
    return out;
  }
}
