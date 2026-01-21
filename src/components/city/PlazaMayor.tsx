import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// Central Pyramid Node
function CentralPyramid() {
  const pyramidRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (pyramidRef.current) {
      pyramidRef.current.rotation.y += 0.002;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main Pyramid */}
      <mesh ref={pyramidRef} position={[0, 5, 0]}>
        <coneGeometry args={[8, 12, 4]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.3}
          metalness={0.8}
          emissive="#00d4ff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Apex Light */}
      <pointLight ref={glowRef} position={[0, 12, 0]} color="#00d4ff" intensity={2} distance={50} />
      
      {/* Energy Ring */}
      <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.2, 16, 100]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Base Platform */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[15, 18, 1, 8]} />
        <meshStandardMaterial
          color="#0f0f1a"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

// District Portal
interface DistrictPortalProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  name: string;
  color: string;
  icon: string;
}

function DistrictPortal({ position, rotation = [0, 0, 0], name, color }: DistrictPortalProps) {
  const portalRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 
        0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <group ref={portalRef} position={position} rotation={rotation}>
      {/* Portal Frame */}
      <mesh>
        <torusGeometry args={[3, 0.3, 16, 100]} />
        <meshStandardMaterial
          color="#2d2d44"
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Portal Energy */}
      <mesh ref={glowRef}>
        <circleGeometry args={[2.7, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Portal Light */}
      <pointLight position={[0, 0, 1]} color={color} intensity={1} distance={20} />
    </group>
  );
}

// Water Channel (Data Flow)
function WaterChannel({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const channelRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (channelRef.current) {
      (channelRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 
        0.2 + Math.sin(state.clock.elapsedTime * 4 + start[0]) * 0.1;
    }
  });

  const direction = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
  const length = direction.length();
  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  ];

  return (
    <mesh 
      ref={channelRef}
      position={midpoint}
      rotation={[0, Math.atan2(direction.x, direction.z), 0]}
    >
      <boxGeometry args={[1.5, 0.1, length]} />
      <meshStandardMaterial
        color="#001a33"
        emissive="#00d4ff"
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Tower Node
function TowerNode({ position, height = 15 }: { position: [number, number, number]; height?: number }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Tower Body */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.8, 1.2, height, 6]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.3}
          metalness={0.7}
          emissive="#00d4ff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Tower Top */}
      <mesh position={[0, height + 0.5, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      <pointLight ref={lightRef} position={[0, height + 1, 0]} color="#00d4ff" intensity={0.5} distance={30} />
    </group>
  );
}

export function PlazaMayor() {
  const districts = [
    { name: 'Templo MSR', color: '#00d4ff', position: [0, 3, -30] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], icon: '🏛️' },
    { name: 'Corte Suprema', color: '#ff00ff', position: [30, 3, 0] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number], icon: '⚖️' },
    { name: 'UTAMV', color: '#00ff88', position: [0, 3, 30] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number], icon: '🎓' },
    { name: 'Tianguis', color: '#d4af37', position: [-30, 3, 0] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number], icon: '💰' },
  ];

  return (
    <group>
      {/* Central Pyramid */}
      <CentralPyramid />

      {/* District Portals */}
      {districts.map((district, i) => (
        <DistrictPortal
          key={i}
          position={district.position}
          rotation={district.rotation}
          name={district.name}
          color={district.color}
          icon={district.icon}
        />
      ))}

      {/* Water Channels connecting districts */}
      <WaterChannel start={[0, -0.3, -10]} end={[0, -0.3, -28]} />
      <WaterChannel start={[10, -0.3, 0]} end={[28, -0.3, 0]} />
      <WaterChannel start={[0, -0.3, 10]} end={[0, -0.3, 28]} />
      <WaterChannel start={[-10, -0.3, 0]} end={[-28, -0.3, 0]} />

      {/* Tower Nodes */}
      <TowerNode position={[20, 0, -20]} height={20} />
      <TowerNode position={[-20, 0, -20]} height={18} />
      <TowerNode position={[20, 0, 20]} height={22} />
      <TowerNode position={[-20, 0, 20]} height={16} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#050510"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Grid Pattern on Ground */}
      <gridHelper args={[200, 100, '#00d4ff', '#001a33']} position={[0, -0.4, 0]} />
    </group>
  );
}
