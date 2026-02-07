import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  Sphere,
  Stars,
} from '@react-three/drei';
import * as THREE from 'three';

/* ======================================================
   COSMIC CORE · TAMV
   El núcleo no decora.
   SOSTIENE.
====================================================== */

/* ===================== CORE ===================== */

function CoreConsciousness() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 0.8) * 0.08;

    ref.current.rotation.y = t * 0.15;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.6, 5]} />
      <meshStandardMaterial
        color="#00d4ff"
        emissive="#00d4ff"
        emissiveIntensity={0.45}
        transparent
        opacity={0.85}
        wireframe
      />
    </mesh>
  );
}

/* ===================== MEMORY FIELD ===================== */

function MemoryField() {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 1200;
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3.5 + Math.random() * 2;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#7dd3fc"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

/* ===================== CELL NODES ===================== */

function CellNode({
  position,
  color,
  energy = 1,
}: {
  position: [number, number, number];
  color: string;
  energy?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.2 * energy;
    ref.current.rotation.y = t * 0.3 * energy;
  });

  return (
    <Float speed={1.5} floatIntensity={0.8}>
      <Sphere ref={ref} args={[0.45, 48, 48]} position={position}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          roughness={0.25}
          metalness={0.7}
        />
      </Sphere>
    </Float>
  );
}

/* ===================== ROOT ===================== */

export function CosmicCore() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 58 }}>
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 6, 22]} />

        {/* Luz = estado emocional */}
        <ambientLight intensity={0.25} />
        <pointLight position={[6, 6, 6]} intensity={1} color="#00d4ff" />
        <pointLight position={[-6, -6, -6]} intensity={0.6} color="#d946ef" />

        {/* Campo estelar */}
        <Stars
          radius={120}
          depth={60}
          count={4000}
          factor={4}
          fade
          speed={0.4}
        />

        {/* Núcleo */}
        <CoreConsciousness />

        {/* Memoria */}
        <MemoryField />

        {/* Cells conscientes */}
        <CellNode position={[-3, 1, -2]} color="#d946ef" energy={0.8} />
        <CellNode position={[3, -1, -3]} color="#00d4ff" energy={1.2} />
        <CellNode position={[2, 2, -4]} color="#f59e0b" energy={0.6} />
      </Canvas>
    </div>
  );
}
