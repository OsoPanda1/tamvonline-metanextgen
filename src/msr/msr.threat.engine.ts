import {
  MSRThreatContext,
  MSRThreatDomain,
  MSRThreatLevel,
  MSRThreatSignal,
  MSRThreatSource,
  MSR_THREAT_LEVEL_WEIGHT,
  MSRThreatPhase,
} from "./msr.threat.types";

const DOMAINS: MSRThreatDomain[] = [
  "security",
  "infrastructure",
  "economy",
  "identity",
  "governance",
  "xr",
  "unknown",
];

const SOURCES: MSRThreatSource[] = [
  "guardiania",
  "radar",
  "eoct",
  "system",
  "external",
];

function maxLevel(a: MSRThreatLevel, b: MSRThreatLevel): MSRThreatLevel {
  return MSR_THREAT_LEVEL_WEIGHT[a] >= MSR_THREAT_LEVEL_WEIGHT[b] ? a : b;
}

function suggestProtocol(level: MSRThreatLevel) {
  if (level === "existential") return "protocolo-fenix";
  if (level === "high") return "protocolo-hoyo-negro";
  return "none";
}

function derivePhase(level: MSRThreatLevel): MSRThreatPhase {
  if (level === "none" || level === "low") return "stable";
  if (level === "medium") return "degrading";
  if (level === "high" || level === "existential") return "critical";
  return "stable";
}

export interface MSRThreatConfig {
  escalationThreshold: MSRThreatLevel;
  existentialThreshold: MSRThreatLevel;
  maxHistorySize: number;
}

const DEFAULT_CONFIG: MSRThreatConfig = {
  escalationThreshold: "high",
  existentialThreshold: "existential",
  maxHistorySize: 10_000,
};

export class MSRThreatEngine {
  private ctx: MSRThreatContext;
  private history: MSRThreatSignal[] = [];
  private readonly config: MSRThreatConfig;

  constructor(config?: Partial<MSRThreatConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    this.ctx = {
      currentLevel: "none",
      highestLevelSeen: "none",
      lastUpdate: Date.now(),

      matrix: {
        byDomain: Object.fromEntries(
          DOMAINS.map((d) => [d, "none"]),
        ) as Record<MSRThreatDomain, MSRThreatLevel>,

        bySource: Object.fromEntries(
          SOURCES.map((s) => [s, 0]),
        ) as Record<MSRThreatSource, number>,
      },

      metrics: {
        totalSignals: 0,
        byLevel: {
          none: 0,
          low: 0,
          medium: 0,
          high: 0,
          existential: 0,
        },
        last24hSignals: 0,
        last1hSignals: 0,
        lastHighOrAboveTs: undefined,
        lastExistentialTs: undefined,
      },

      phase: "stable",
      escalationRequired: false,
      eoctNotified: false,
      anchoredInMSR: false,
      anchoredInBookPI: false,
    };
  }

  getContext(): MSRThreatContext {
    return this.ctx;
  }

  getHistory(limit = 200): MSRThreatSignal[] {
    return this.history.slice(-limit);
  }

  register(signal: MSRThreatSignal): MSRThreatContext {
    const now = Date.now();

    // Historia con límite
    this.history.push(signal);
    if (this.history.length > this.config.maxHistorySize) {
      this.history = this.history.slice(-this.config.maxHistorySize / 2);
    }

    // Métricas básicas
    this.ctx.metrics.totalSignals++;
    this.ctx.metrics.byLevel[signal.level]++;
    this.ctx.matrix.bySource[signal.source]++;

    const last24h = now - 24 * 60 * 60 * 1000;
    const last1h = now - 60 * 60 * 1000;

    this.ctx.metrics.last24hSignals = this.history.filter(
      (s) => s.ts >= last24h,
    ).length;

    this.ctx.metrics.last1hSignals = this.history.filter(
      (s) => s.ts >= last1h,
    ).length;

    // Dominios
    this.ctx.matrix.byDomain[signal.domain] = maxLevel(
      this.ctx.matrix.byDomain[signal.domain],
      signal.level,
    );

    // Niveles globales
    this.ctx.currentLevel = maxLevel(
      this.ctx.currentLevel,
      signal.level,
    );

    this.ctx.highestLevelSeen = maxLevel(
      this.ctx.highestLevelSeen,
      signal.level,
    );

    if (signal.level === "high" || signal.level === "existential") {
      this.ctx.metrics.lastHighOrAboveTs = now;
    }
    if (signal.level === "existential") {
      this.ctx.metrics.lastExistentialTs = now;
    }

    this.ctx.lastSignal = signal;
    this.ctx.lastUpdate = now;
    this.ctx.suggestedProtocol = suggestProtocol(this.ctx.currentLevel);
    this.ctx.phase = derivePhase(this.ctx.currentLevel);

    this.ctx.escalationRequired =
      MSR_THREAT_LEVEL_WEIGHT[this.ctx.currentLevel] >=
      MSR_THREAT_LEVEL_WEIGHT[this.config.escalationThreshold];

    return this.ctx;
  }

  /** EOCT confirma recepción de la alerta global */
  markEOCTNotified() {
    this.ctx.eoctNotified = true;
  }

  /** MSR/BookPI marcan que este episodio ya fue anclado */
  markAnchored(options: { msr?: boolean; bookpi?: boolean }) {
    if (options.msr) this.ctx.anchoredInMSR = true;
    if (options.bookpi) this.ctx.anchoredInBookPI = true;
  }

  /** Guardianía/EOCT relajan estado global */
  relax(target: MSRThreatLevel = "low") {
    this.ctx.currentLevel = target;
    this.ctx.suggestedProtocol = suggestProtocol(target);
    this.ctx.phase = derivePhase(target);
    this.ctx.lastUpdate = Date.now();
    this.ctx.escalationRequired = false;
    this.ctx.eoctNotified = false;
  }
}
