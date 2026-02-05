// world/CentralPortal.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CentralPortal() {
  const portalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (portalRef.current) {
      portalRef.current.rotation.z = t * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.35;
      ringRef.current.rotation.x = Math.sin(t * 0.6) * 0.18;
    }
  });

  return (
    <group position={[0, 3, -18]}>
      {/* Anillo exterior */}
      <mesh ref={ringRef} castShadow receiveShadow>
        <torusGeometry args={[5.2, 0.35, 20, 120]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1.35}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Núcleo del portal */}
      <mesh ref={portalRef}>
        <circleGeometry args={[4.1, 80]} />
        <meshStandardMaterial
          color="#050515"
          emissive="#d946ef"
          emissiveIntensity={0.55}
          metalness={1}
          roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glow */}
      <pointLight color="#d946ef" intensity={6} distance={26} />
      <pointLight color="#00d4ff" intensity={4} distance={18} position={[0, 0, 1.3]} />
    </group>
  );
}
