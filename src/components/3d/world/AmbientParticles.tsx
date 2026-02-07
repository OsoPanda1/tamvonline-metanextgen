// world/AmbientParticles.tsx
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ======================================================
   AMBIENT PARTICLES · TAMV
   Mantiene nombre.
   Evoluciona consciencia.
====================================================== */

type Mood = 'calm' | 'active' | 'alert' | 'containment';

interface AmbientParticlesProps {
  count?: number;        // compatibilidad total
  mood?: Mood;           // NUEVO (opcional)
  intensity?: number;    // NUEVO (LOD simple)
}

export function AmbientParticles({
  count = 400,
  mood = 'calm',
  intensity = 1,
}: AmbientParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null);

  /* ===================== DISTRIBUCIÓN ===================== */

  const positions = useMemo(() => {
    const total = Math.floor(count * intensity);
    const arr = new Float32Array(total * 3);

    for (let i = 0; i < total; i++) {
      const radius = 30 + Math.random() * 90;
      const angle = Math.random() * Math.PI * 2;

      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = Math.random() * 40;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }

    return arr;
  }, [count, intensity]);

  /* ===================== COMPORTAMIENTO ===================== */

  useFrame((state) => {
    if (!particlesRef.current) return;

    const t = state.clock.elapsedTime;

    let rotSpeed = 0.015;
    let sway = 0.002;

    switch (mood) {
      case 'active':
        rotSpeed = 0.03;
        sway = 0.006;
        break;
      case 'alert':
        rotSpeed = 0.055;
        sway = 0.01;
        break;
      case 'containment':
        rotSpeed = 0.005;
        sway = 0.001;
        break;
    }

    particlesRef.current.rotation.y = t * rotSpeed;
    particlesRef.current.rotation.x = Math.sin(t * 0.25) * sway;
  });

  /* ===================== MATERIAL ===================== */

  const color =
    mood === 'alert'
      ? '#f59e0b'
      : mood === 'containment'
      ? '#64748b'
      : '#00d4ff';

  const opacity =
    mood === 'containment'
      ? 0.25
      : mood === 'alert'
      ? 0.75
      : 0.65;

  const size =
    mood === 'active'
      ? 0.22
      : mood === 'containment'
      ? 0.12
      : 0.18;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
