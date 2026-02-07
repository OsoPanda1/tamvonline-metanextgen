import { SignalBus } from "./SignalBus";
import { StateSynthesizer } from "./StateSynthesizer";
import { IntentGenerator } from "./IntentGenerator";
import { ConstitutionalGate } from "./ConstitutionalGate";
import { MetaCognitiveGovernor } from "../meta/MetaCognitiveGovernor";
import { CognitiveState } from "../types/state.types";

export class CognitiveMachine {
  private bus = new SignalBus();
  private synth = new StateSynthesizer();
  private intents = new IntentGenerator();
  private meta = new MetaCognitiveGovernor();

  constructor(
    private state: CognitiveState,
    private constitution: ConstitutionalGate,
  ) {}

  ingest(signal: any) {
    this.bus.ingest(signal);
  }

  tick() {
    const signals = this.bus.drain();
    this.state = this.synth.synthesize(this.state, signals);

    const intents = this.intents.generate(this.state);
    const assessment = this.meta.assess(this.state, intents);

    const executable = intents.filter(i => {
      const verdict = this.constitution.evaluate(this.state, i);
      return verdict.allowed && !this.meta.shouldDampen(assessment);
    });

    return {
      state: this.state,
      intents,
      executable,
    };
  }
}
