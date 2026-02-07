// src/protocols/protocol.monitoring.guardian.ts
/**
 * PROTOCOL MONITORING GUARDIAN — TAMV
 * ----------------------------------
 * Punto focal visual y narrativo de los protocolos TAMV.
 *
 * - Integra estado de ProtocolEngine + ProtocolLifecycle (via ProtocolContext).
 * - Traduce estados técnicos a visuales comprensibles (2D / XR / social).
 * - Gestiona su propia FSM de monitor (guardianState) para evitar ruido.
 * - Expone un modelo de dashboard para MSRThreatLevel.
 * - Emite alertas visuales en tiempo real de forma ética y no sensacionalista.
 */

import {
  ProtocolContext,
  ProtocolState,
  ProtocolThreatLevel,
} from "./protocol.types";

/* ======================================================
 * 0. FSM DEL GUARDIÁN (PROPIO)
 * ====================================================== */

export type GuardianState =
  | "idle" // sin datos / no enganchado
  | "observing" // recibiendo contextos válidos
  | "degraded" // datos inconsistentes o parciales
  | "disconnected"; // fuente cortada / error duro

const ALLOWED_GUARDIAN_TRANSITIONS: Record<GuardianState, GuardianState[]> = {
  idle: ["observing", "disconnected"],
  observing: ["degraded", "disconnected"],
  degraded: ["observing", "disconnected"],
  disconnected: ["idle"],
};

function assertGuardianTransition(from: GuardianState, to: GuardianState) {
  if (!ALLOWED_GUARDIAN_TRANSITIONS[from].includes(to)) {
    throw new Error(
      `[GUARDIAN FSM] Invalid transition ${from} → ${to}`,
    );
  }
}

/* ======================================================
 * 1. LENGUAJE HUMANO + VISUAL (CAPA SEMÁNTICA)
 * ====================================================== */

export type GuardianVisualLevel =
  | "calm"
  | "attention"
  | "alert"
  | "critical";

export interface VisualDescriptor {
  level: GuardianVisualLevel; // nivel abstracto para temas / skins
  color: string; // HEX / theme token
  icon: string; // icono simbólico (UI / XR)
  pulse: boolean; // animación viva
  intensity: number; // 0..1 (para XR / shaders)
  accessibleLabel: string; // texto para lectores de pantalla
}

/**
 * Traducción estatal base (FSM protocolos → base visual)
 * La semántica exacta se ajusta con el nivel de amenaza.
 */
const BASE_STATE_TO_VISUAL: Record<
  ProtocolState,
  Omit<VisualDescriptor, "level" | "accessibleLabel">
> = {
  idle: {
    color: "#4cafef",
    icon: "🜂",
    pulse: false,
    intensity: 0.2,
  },
  arming: {
    color: "#ffd54f",
    icon: "⧗",
    pulse: true,
    intensity: 0.4,
  },
  active: {
    color: "#ff7043",
    icon: "⚠",
    pulse: true,
    intensity: 0.7,
  },
  contained: {
    color: "#ffa726",
    icon: "⬡",
    pulse: false,
    intensity: 0.5,
  },
  recovering: {
    color: "#81c784",
    icon: "✦",
    pulse: true,
    intensity: 0.3,
  },
  terminated: {
    color: "#9e9e9e",
    icon: "◼",
    pulse: false,
    intensity: 0.1,
  },
};

function levelFromStateAndThreat(
  state: ProtocolState,
  threat?: ProtocolThreatLevel,
): GuardianVisualLevel {
  if (state === "idle" || state === "terminated") return "calm";

  if (state === "arming" || state === "recovering") {
    if (!threat || threat === "low") return "attention";
    if (threat === "medium") return "alert";
    return "critical";
  }

  if (state === "contained") {
    if (!threat || threat === "low") return "attention";
    return "alert";
  }

  // active
  if (!threat || threat === "low") return "alert";
  return "critical";
}

function accessibleLabelFor(
  state: ProtocolState,
  level: GuardianVisualLevel,
): string {
  switch (state) {
    case "idle":
      return "Sistema en equilibrio, sin amenazas activas";
    case "arming":
      return "Preparación preventiva, revisiones en curso";
    case "active":
      return level === "critical"
        ? "Protocolo activo en situación crítica"
        : "Protocolo activo y vigilando riesgos";
    case "contained":
      return "Amenaza contenida, vigilancia mantenida";
    case "recovering":
      return "Recuperación en curso, restaurando funciones normales";
    case "terminated":
      return "Ciclo de protocolo cerrado, registro preservado";
  }
}

/* ======================================================
 * 2. MENSAJES NARRATIVOS (SOCIAL / CIUDADANOS)
 * ====================================================== */

export interface GuardianNarrative {
  title: string;
  description: string;
  tone: "informative" | "reassuring" | "urgent" | "ceremonial";
  suggestedAction?: string;
}

function narrativeForState(ctx: ProtocolContext): GuardianNarrative {
  switch (ctx.state) {
    case "idle":
      return {
        title: "Sistema en equilibrio",
        description:
          "El protocolo está definido, vigilante y preparado. No se detectan amenazas activas.",
        tone: "reassuring",
        suggestedAction:
          "No se requiere acción. Puedes explorar otros espacios de TAMV con tranquilidad.",
      };

    case "arming":
      return {
        title: "Preparación preventiva",
        description:
          "Se realizan verificaciones técnicas, éticas y comunitarias antes de una posible activación.",
        tone: "informative",
        suggestedAction:
          "Mantente informado. Revisa los criterios de activación publicados por la comunidad.",
      };

    case "active":
      return {
        title: "Protocolo activo",
        description:
          "El sistema ha activado medidas extraordinarias para proteger la integridad colectiva, priorizando el principio de no daño.",
        tone: "urgent",
        suggestedAction:
          "Sigue las indicaciones visibles en la interfaz. Si tienes dudas, consulta los canales de apoyo comunitario.",
      };

    case "contained":
      return {
        title: "Amenaza contenida",
        description:
          "La situación está bajo control. Se mantienen medidas de vigilancia para evitar recaídas.",
        tone: "reassuring",
        suggestedAction:
          "Continúa tus actividades con atención moderada a los avisos del sistema.",
      };

    case "recovering":
      return {
        title: "Recuperación en curso",
        description:
          "El sistema trabaja para restaurar plenamente las funciones normales, documentando lo aprendido.",
        tone: "informative",
        suggestedAction:
          "Puedes aportar retroalimentación. Tus comentarios ayudan a mejorar los protocolos.",
      };

    case "terminated":
      return {
        title: "Ciclo cerrado",
        description:
          "El protocolo ha concluido. El registro se preserva como memoria colectiva y material de aprendizaje.",
        tone: "ceremonial",
        suggestedAction:
          "Explora el informe público del ciclo para entender qué sucedió y qué se mejorará.",
      };
  }
}

/* ======================================================
 * 3. DASHBOARD VISUAL PARA MSRThreatLevel
 * ====================================================== */

export interface ThreatLevelDashboardEntry {
  timestamp: number;
  threatLevel: ProtocolThreatLevel;
  protocolState: ProtocolState;
  msrBlockIndex?: number;
}

export interface ThreatDashboardModel {
  protocolId: string;
  // timeline cruda para gráficos (líneas, heatmaps, XR timelines)
  history: ThreatLevelDashboardEntry[];
  // KPI de estado actual
  currentThreat?: ProtocolThreatLevel;
  currentState: ProtocolState;
}

/* ======================================================
 * 4. EVENTOS OBSERVABLES Y ALERTAS
 * ====================================================== */

export interface GuardianObservableEvent {
  protocolId: string;
  state: ProtocolState;
  visual: VisualDescriptor;
  narrative: GuardianNarrative;

  // Metadatos para overlays XR / dashboards
  ts: number;
  authority?: string;
  threatLevel?: ProtocolThreatLevel;

  // Referencias de verdad verificable
  msrBlockIndex?: number;
  bookpiAnchorId?: string;

  // Hints para routing / escenas XR
  routeHint?: string;
  xrSceneHint?: string;
}

export type AlertSeverity = "info" | "warning" | "critical";

export interface GuardianAlert {
  severity: AlertSeverity;
  message: string;
  protocolId: string;
  state: ProtocolState;
  threatLevel?: ProtocolThreatLevel;
  ts: number;
}

/* ======================================================
 * 5. GUARDIAN ENGINE
 * ====================================================== */

export class ProtocolMonitoringGuardian {
  private lastState?: ProtocolState;
  private lastThreat?: ProtocolThreatLevel;
  private guardianState: GuardianState = "idle";
  private readonly threatHistory: ThreatLevelDashboardEntry[] = [];

  constructor(
    private readonly onEvent: (event: GuardianObservableEvent) => void,
    private readonly onAlert: (alert: GuardianAlert) => void,
  ) {}

  getGuardianState(): GuardianState {
    return this.guardianState;
  }

  getThreatDashboard(protocolId: string): ThreatDashboardModel {
    return {
      protocolId,
      history: [...this.threatHistory],
      currentThreat: this.lastThreat,
      currentState: this.lastState ?? "idle",
    };
  }

  /**
   * Observa el contexto del protocolo y emite:
   *  - evento visual/narrativo (si cambia estado o amenaza)
   *  - alertas (según cambios de nivel)
   *  - entradas para dashboard de MSRThreatLevel
   *
   * Pensado para ser llamado desde:
   *  - cambios de ProtocolEngine (activaciones, contenciones…)
   *  - cambios de ProtocolLifecycle (transiciones FSM)
   */
  observe(ctx: ProtocolContext): void {
    if (!ctx) {
      this.setGuardianState("disconnected");
      return;
    }

    // Si el contexto es incoherente (sin estado, sin id) => degradado
    if (!ctx.id || !ctx.state) {
      this.setGuardianState("degraded");
      return;
    }

    this.setGuardianState("observing");

    const stateChanged = ctx.state !== this.lastState;
    const threatChanged = ctx.lastThreatLevel !== this.lastThreat;

    if (!stateChanged && !threatChanged) {
      return;
    }

    const now = Date.now();
    this.lastState = ctx.state;
    this.lastThreat = ctx.lastThreatLevel;

    // Actualizamos dashboard de amenaza
    if (ctx.lastThreatLevel) {
      this.threatHistory.push({
        timestamp: now,
        threatLevel: ctx.lastThreatLevel,
        protocolState: ctx.state,
        msrBlockIndex: ctx.lastMSRBlockIndex,
      });
    }

    // Visual/narrativa
    const base = BASE_STATE_TO_VISUAL[ctx.state];
    const level = levelFromStateAndThreat(ctx.state, ctx.lastThreatLevel);
    const visual: VisualDescriptor = {
      ...base,
      level,
      accessibleLabel: accessibleLabelFor(ctx.state, level),
    };
    const narrative = narrativeForState(ctx);

    const event: GuardianObservableEvent = {
      protocolId: ctx.id,
      state: ctx.state,
      visual,
      narrative,
      ts: now,
      authority: ctx.authority,
      threatLevel: ctx.lastThreatLevel,
      msrBlockIndex: ctx.lastMSRBlockIndex,
      bookpiAnchorId: ctx.lastAnchorId,
      routeHint: `/guardian/protocols/${ctx.id}`,
      xrSceneHint: `xr://guardian/protocol/${ctx.id}/${ctx.state}`,
    };

    this.onEvent(event);

    // Alertas visuales en tiempo real (no sensacionalistas)
    this.emitAlerts(ctx, stateChanged, threatChanged, now);
  }

  /**
   * Permite resetear el guardián, por ejemplo al cambiar de sesión
   * o cuando la UI quiere forzar la re-emisión del estado actual.
   */
  reset(): void {
    this.lastState = undefined;
    this.lastThreat = undefined;
    this.threatHistory.length = 0;
    this.setGuardianState("idle");
  }

  /* ============================
   * FSM INTERNA DEL GUARDIÁN
   * ============================ */
  private setGuardianState(next: GuardianState): void {
    if (next === this.guardianState) return;
    assertGuardianTransition(this.guardianState, next);
    this.guardianState = next;
  }

  /* ============================
   * ALERTAS VISUALES
   * ============================ */
  private emitAlerts(
    ctx: ProtocolContext,
    stateChanged: boolean,
    threatChanged: boolean,
    ts: number,
  ): void {
    // 1. Alertas por estado
    if (stateChanged) {
      if (ctx.state === "active") {
        this.onAlert({
          severity: ctx.lastThreatLevel === "high" ? "critical" : "warning",
          message:
            "Un protocolo se ha activado. El sistema está aplicando medidas de protección colectiva.",
          protocolId: ctx.id,
          state: ctx.state,
          threatLevel: ctx.lastThreatLevel,
          ts,
        });
      } else if (ctx.state === "contained") {
        this.onAlert({
          severity: "info",
          message: "Una amenaza ha sido contenida. Se mantiene vigilancia.",
          protocolId: ctx.id,
          state: ctx.state,
          threatLevel: ctx.lastThreatLevel,
          ts,
        });
      } else if (ctx.state === "terminated") {
        this.onAlert({
          severity: "info",
          message:
            "Un ciclo de protocolo ha concluido. El informe completo estará disponible para consulta.",
          protocolId: ctx.id,
          state: ctx.state,
          threatLevel: ctx.lastThreatLevel,
          ts,
        });
      }
    }

    // 2. Alertas por cambios fuertes de nivel de amenaza
    if (threatChanged && ctx.lastThreatLevel) {
      if (ctx.lastThreatLevel === "high") {
        this.onAlert({
          severity: "critical",
          message:
            "El nivel de amenaza ha escalado a alto. El sistema prioriza la seguridad y la transparencia.",
          protocolId: ctx.id,
          state: ctx.state,
          threatLevel: ctx.lastThreatLevel,
          ts,
        });
      } else if (ctx.lastThreatLevel === "medium") {
        this.onAlert({
          severity: "warning",
          message:
            "El nivel de amenaza es medio. Se han fortalecido las medidas de vigilancia.",
          protocolId: ctx.id,
          state: ctx.state,
          threatLevel: ctx.lastThreatLevel,
          ts,
        });
      } else if (ctx.lastThreatLevel === "low") {
        this.onAlert({
          severity: "info",
          message:
            "El nivel de amenaza es bajo. El sistema continúa monitoreando en segundo plano.",
          protocolId: ctx.id,
          state: ctx.state,
          threatLevel: ctx.lastThreatLevel,
          ts,
        });
      }
    }
  }
}
