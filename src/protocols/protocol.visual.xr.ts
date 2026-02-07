// src/protocols/protocol.visual.xr.ts
/**
 * TAMV — PROTOCOL XR VISUAL TRANSLATION LAYER
 * ==========================================
 *
 * Este módulo define CÓMO SE VE EL PODER cuando TAMV actúa.
 *
 * No renderiza.
 * No dibuja.
 * No inventa formas.
 *
 * Traduce estados soberanos a:
 *  - Escenarios urbanos hiper-realistas
 *  - Condiciones ambientales físicas
 *  - Coreografías de cámara cinematográficas
 *  - Señales visuales entendibles por cualquier civil
 *
 * Cualquier motor gráfico que consuma este contrato
 * debe respetar la doctrina visual TAMV y evitar HUDs gamificados
 * o espectáculos de miedo. El mundo ES la interfaz.
 *
 * Si esto se conecta a un motor gráfico serio,
 * el mundo ENTIENDE lo que está pasando sin leer nada.
 */

import { GuardianObservableEvent, GuardianVisualLevel } from "./protocol.monitoring.guardian";

/* ======================================================
 * CAPA 1 — DOCTRINA VISUAL (INNEGOCIABLE)
 * ====================================================== */

export const XR_VISUAL_DOCTRINE = {
  worldIsTheInterface: true,
  noAbstractPrimitives: true,
  hyperRealismOnly: true,
  noGamification: true,
  noFearPorn: true,
  civiliansMustUnderstand: true,
  powerMovesSlow: true,
} as const;

export type XRVisualDoctrine = typeof XR_VISUAL_DOCTRINE;

/* ======================================================
 * CAPA 2 — ESCENARIOS MACRO (CIUDAD COMO ORGANISMO)
 * ====================================================== */

export type XRMacroScene =
  | "normal_civil_life"
  | "silent_alignment"
  | "exceptional_state"
  | "threat_contained"
  | "active_repair"
  | "historical_record";

export interface XRWorldEnvironment {
  timeOfDay: "dawn" | "day" | "dusk" | "night";
  weather: "clear" | "cloudy" | "rain" | "storm" | "smog";
  visibilityKm: number;
  powerGridStress: "low" | "moderate" | "high" | "critical";
  trafficLevel: "minimal" | "reduced" | "normal";
  civilianMovement: "free" | "guided" | "restricted";
}

/* ======================================================
 * CAPA 3 — CÁMARA (NARRATIVA SIN TEXTO)
 * ====================================================== */

export interface XRCameraLanguage {
  rig:
    | "human_eye_level"
    | "aerial_slow_orbit"
    | "infrastructure_tracking"
    | "wide_civic_overview";
  altitudeMeters: number;
  speed: "static" | "slow" | "measured";
  focalIntent:
    | "people"
    | "infrastructure"
    | "logistics"
    | "city_scale";
}

/* ======================================================
 * CAPA 4 — SEÑALES VISUALES NO INTRUSIVAS
 * ====================================================== */

export interface XRVisualSignals {
  infrastructureGlow: "none" | "transport" | "energy" | "institutions" | "all";
  dataFlowsVisible: boolean;
  emergencyVehiclesPresence: "none" | "limited" | "coordinated";
  publicDisplaysMode: "normal" | "informative" | "directive";
}

/* ======================================================
 * CAPA 5 — TONO EMOCIONAL GLOBAL
 * ====================================================== */

export interface XRAffect {
  tension: number;        // 0..1
  reassurance: number;    // 0..1
  urgency: number;        // 0..1
  authority: number;      // 0..1
}

function affectFor(event: GuardianObservableEvent): XRAffect {
  const level: GuardianVisualLevel = event.visual.level;

  return {
    tension:
      level === "critical" ? 0.9 :
      level === "alert" ? 0.6 :
      level === "attention" ? 0.35 :
      0.15,
    reassurance:
      level === "calm" ? 0.9 :
      level === "attention" ? 0.7 :
      0.45,
    urgency: event.state === "active"
      ? (level === "critical" ? 0.95 : 0.8)
      : event.state === "arming"
        ? 0.45
        : 0.2,
    authority: event.authority === "eoct" ? 1 : 0.7,
  };
}

/* ======================================================
 * CAPA 6 — HYPER REAL SCENE FEDERADA
 * ====================================================== */

export interface XRHyperRealScene {
  id: string;

  doctrine: XRVisualDoctrine;

  macroScene: XRMacroScene;
  environment: XRWorldEnvironment;
  camera: XRCameraLanguage;
  signals: XRVisualSignals;
  affect: XRAffect;

  renderHints: {
    worldPreset: string;
    cameraPreset: string;
    postProcessPreset: string;
  };

  metadata: {
    protocolId: string;
    protocolState: string;
    authority?: string;
    msrBlockIndex?: number;
    bookpiAnchorId?: string;
    narrativeLabel: string;
  };
}

/* ======================================================
 * CAPA 7 — MOTOR DE TRADUCCIÓN (NÚCLEO FEDERADO)
 * ====================================================== */

export class ProtocolXRVisualEngine {
  /**
   * Traduce un evento del guardián en una escena XR hiperreal lista
   * para ser interpretada por un motor gráfico serio.
   * Cualquier implementación downstream que consuma este contrato
   * está obligada a respetar XR_VISUAL_DOCTRINE.
   */
  public manifest(event: GuardianObservableEvent): XRHyperRealScene {
    const macroScene = this.macroSceneFor(event);

    return {
      id: `xr_${event.protocolId}_${event.state}_${event.ts}`,

      doctrine: XR_VISUAL_DOCTRINE,

      macroScene,
      environment: this.environmentFor(macroScene),
      camera: this.cameraFor(macroScene),
      signals: this.signalsFor(macroScene),
      affect: affectFor(event),

      renderHints: {
        worldPreset: `world_${macroScene}`,
        cameraPreset: `camera_${macroScene}`,
        postProcessPreset: `pp_${event.visual.level}`,
      },

      metadata: {
        protocolId: event.protocolId,
        protocolState: event.state,
        authority: event.authority,
        msrBlockIndex: event.msrBlockIndex,
        bookpiAnchorId: event.bookpiAnchorId,
        narrativeLabel: this.labelFor(event),
      },
    };
  }

  /* ===================== MAPEO DURO (ESTADO → ESCENA) ===================== */

  private macroSceneFor(event: GuardianObservableEvent): XRMacroScene {
    switch (event.state) {
      case "idle":
        return "normal_civil_life";
      case "arming":
        return "silent_alignment";
      case "active":
        return "exceptional_state";
      case "contained":
        return "threat_contained";
      case "recovering":
        return "active_repair";
      case "terminated":
      default:
        return "historical_record";
    }
  }

  private environmentFor(scene: XRMacroScene): XRWorldEnvironment {
    switch (scene) {
      case "exceptional_state":
        return {
          timeOfDay: "night",
          weather: "storm",
          visibilityKm: 4,
          powerGridStress: "critical",
          trafficLevel: "minimal",
          civilianMovement: "guided",
        };
      case "silent_alignment":
        return {
          timeOfDay: "night",
          weather: "cloudy",
          visibilityKm: 8,
          powerGridStress: "moderate",
          trafficLevel: "reduced",
          civilianMovement: "free",
        };
      case "threat_contained":
        return {
          timeOfDay: "night",
          weather: "rain",
          visibilityKm: 6,
          powerGridStress: "high",
          trafficLevel: "reduced",
          civilianMovement: "guided",
        };
      case "active_repair":
        return {
          timeOfDay: "dawn",
          weather: "cloudy",
          visibilityKm: 12,
          powerGridStress: "moderate",
          trafficLevel: "normal",
          civilianMovement: "free",
        };
      case "historical_record":
        return {
          timeOfDay: "dusk",
          weather: "clear",
          visibilityKm: 20,
          powerGridStress: "low",
          trafficLevel: "normal",
          civilianMovement: "free",
        };
      case "normal_civil_life":
      default:
        return {
          timeOfDay: "day",
          weather: "clear",
          visibilityKm: 25,
          powerGridStress: "low",
          trafficLevel: "normal",
          civilianMovement: "free",
        };
    }
  }

  private cameraFor(scene: XRMacroScene): XRCameraLanguage {
    switch (scene) {
      case "exceptional_state":
        return {
          rig: "aerial_slow_orbit",
          altitudeMeters: 800,
          speed: "slow",
          focalIntent: "city_scale",
        };
      case "silent_alignment":
        return {
          rig: "infrastructure_tracking",
          altitudeMeters: 120,
          speed: "measured",
          focalIntent: "logistics",
        };
      case "active_repair":
        return {
          rig: "human_eye_level",
          altitudeMeters: 2,
          speed: "slow",
          focalIntent: "people",
        };
      case "threat_contained":
      case "historical_record":
        return {
          rig: "wide_civic_overview",
          altitudeMeters: 300,
          speed: "static",
          focalIntent: "infrastructure",
        };
      case "normal_civil_life":
      default:
        return {
          rig: "human_eye_level",
          altitudeMeters: 2,
          speed: "slow",
          focalIntent: "people",
        };
    }
  }

  private signalsFor(scene: XRMacroScene): XRVisualSignals {
    switch (scene) {
      case "exceptional_state":
        return {
          infrastructureGlow: "all",
          dataFlowsVisible: true,
          emergencyVehiclesPresence: "coordinated",
          publicDisplaysMode: "directive",
        };
      case "silent_alignment":
        return {
          infrastructureGlow: "institutions",
          dataFlowsVisible: true,
          emergencyVehiclesPresence: "limited",
          publicDisplaysMode: "informative",
        };
      case "threat_contained":
        return {
          infrastructureGlow: "energy",
          dataFlowsVisible: true,
          emergencyVehiclesPresence: "limited",
          publicDisplaysMode: "informative",
        };
      case "active_repair":
        return {
          infrastructureGlow: "transport",
          dataFlowsVisible: true,
          emergencyVehiclesPresence: "limited",
          publicDisplaysMode: "informative",
        };
      case "historical_record":
      case "normal_civil_life":
      default:
        return {
          infrastructureGlow: "none",
          dataFlowsVisible: false,
          emergencyVehiclesPresence: "none",
          publicDisplaysMode: "normal",
        };
    }
  }

  private labelFor(event: GuardianObservableEvent): string {
    return `${event.protocolId.toUpperCase()} — ${event.state.toUpperCase()}`;
  }
}
