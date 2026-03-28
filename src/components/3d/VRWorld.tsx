import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Stars,
  Environment,
} from '@react-three/drei';

import { CameraSystem } from './systems/CameraSystem';
import { WorldLighting } from './systems/WorldLighting';
import { WorldEnvironment } from './systems/WorldEnvironment';
import { CivilizationalLayer } from './world/CivilizationalLayer';
import { AvatarLayer } from './world/AvatarLayer';
import { IsabellaField } from './world/IsabellaField';
import { WorldHUD } from './world/WorldHUD';

/* ======================================================
   VRWORLD · TAMV
   Un mundo no se renderiza.
   Se HABITA.
====================================================== */

export function VRWorld() {
  const dpr = useMemo<[number, number]>(() => [1, 1.75], []);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        dpr={dpr}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#020314']} />
        <fog attach="fog" args={['#050510', 30, 140]} />

        <Suspense fallback={null}>
          <WorldRoot />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ===================== ROOT ===================== */

function WorldRoot() {
  return (
    <>
      {/* Sistema de cámara consciente */}
      <CameraSystem mode="exploration" />

      {/* Luz = atmósfera emocional */}
      <WorldLighting />

      {/* Entorno cósmico */}
      <WorldEnvironment />

      {/* Consciencia ambiental */}
      <IsabellaField />

      {/* Geografía + civilización */}
      <CivilizationalLayer />

      {/* Avatares (humanos / agentes) */}
      <AvatarLayer />

      {/* HUD semántico */}
      <WorldHUD />
    </>
  );
}
// Modified
