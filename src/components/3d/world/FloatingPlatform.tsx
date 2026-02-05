// world/FloatingPlatform.tsx
import { Float, Html } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Props = {
  id: string;
  position: [number, number, number];
  color: string;
  label: string;
  description?: string;
};

export function FloatingPlatform({ id, position, color, label, description }: Props) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(t + position[0] * 0.3) * 0.4;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.6}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[3.2, 3.2, 0.55, 40]} />
          <meshStandardMaterial
            color={hovered ? '#ffffff' : color}
            emissive={color}
            emissiveIntensity={hovered ? 1.1 : 0.35}
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>

        {/* Label contextual */}
        {hovered && (
          <Html center distanceFactor={12} position={[0, 2.1, 0]}>
            <div className="px-4 py-2 bg-background/90 rounded-lg border border-primary/30 whitespace-nowrap">
              <p className="text-sm font-display text-primary">{label}</p>
              {description && (
                <p className="mt-1 text-xs text-muted-foreground max-w-xs">{description}</p>
              )}
              <p className="mt-1 text-[10px] text-muted-foreground/70">
                [Módulo ID: {id.toUpperCase()}]
              </p>
            </div>
          </Html>
        )}

        <pointLight color={color} intensity={2.4} distance={11} position={[0, 1.2, 0]} />
      </group>
    </Float>
  );
}
