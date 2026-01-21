import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

// Isabella's Ethereal Form
function IsabellaPresence() {
  const presenceRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [pulse, setPulse] = useState(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (presenceRef.current) {
      presenceRef.current.position.y = 3 + Math.sin(t * 0.5) * 0.3;
      presenceRef.current.rotation.y += 0.003;
    }
    
    if (coreRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      coreRef.current.scale.setScalar(scale);
      setPulse(Math.sin(t * 2) * 0.5 + 0.5);
    }
  });

  return (
    <group ref={presenceRef} position={[0, 3, 0]}>
      {/* Core Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Inner Glow */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00d4ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Orbiting Rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[(i * Math.PI) / 3, 0, (i * Math.PI) / 6]}>
          <torusGeometry args={[2 + i * 0.3, 0.02, 16, 100]} />
          <meshStandardMaterial
            color={i === 0 ? "#00d4ff" : i === 1 ? "#ff00ff" : "#d4af37"}
            emissive={i === 0 ? "#00d4ff" : i === 1 ? "#ff00ff" : "#d4af37"}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      
      {/* Light Source */}
      <pointLight color="#ff00ff" intensity={2} distance={30} />
      <pointLight color="#00d4ff" intensity={1} distance={20} position={[0, 2, 0]} />
    </group>
  );
}

// Sacred Pool (Water-Data)
function SacredPool() {
  const poolRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (poolRef.current) {
      (poolRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 
        0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={poolRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
      <circleGeometry args={[8, 64]} />
      <meshStandardMaterial
        color="#001a33"
        emissive="#00d4ff"
        emissiveIntensity={0.1}
        roughness={0.1}
        metalness={0.9}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Sanctuary Columns
function SanctuaryColumn({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Column Body */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 10, 8]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.3}
          metalness={0.7}
          emissive="#ff00ff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Column Capital */}
      <mesh position={[0, 10.2, 0]}>
        <boxGeometry args={[1.2, 0.4, 1.2]} />
        <meshStandardMaterial
          color="#2d2d44"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Light Crystal */}
      <mesh position={[0, 11, 0]}>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight position={[0, 11, 0]} color="#ff00ff" intensity={0.3} distance={10} />
    </group>
  );
}

// Wisdom Whispers (Floating text particles)
function WisdomWhispers() {
  const wisdoms = [
    "La dignidad no se negocia",
    "La ética primero",
    "Soberanía digital",
    "Memoria eterna",
    "Guardianía activa"
  ];

  return (
    <group>
      {wisdoms.map((wisdom, i) => {
        const angle = (i / wisdoms.length) * Math.PI * 2;
        const radius = 6;
        
        return (
          <Float key={i} speed={1} rotationIntensity={0} floatIntensity={0.5}>
            <Html
              center
              position={[
                Math.cos(angle) * radius,
                2 + i * 0.3,
                Math.sin(angle) * radius
              ]}
              distanceFactor={15}
            >
              <div className="text-xs text-primary/50 font-display whitespace-nowrap">
                {wisdom}
              </div>
            </Html>
          </Float>
        );
      })}
    </group>
  );
}

// Ethereal Particles
function EtherealParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 12 + 3;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 15;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ff00ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export function SantuarioIsabella() {
  // Column positions in a circle
  const columnPositions: [number, number, number][] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 10;
    columnPositions.push([
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ]);
  }

  return (
    <group>
      {/* Sacred Pool */}
      <SacredPool />
      
      {/* Isabella's Presence */}
      <IsabellaPresence />
      
      {/* Sanctuary Columns */}
      {columnPositions.map((pos, i) => (
        <SanctuaryColumn key={i} position={pos} />
      ))}
      
      {/* Wisdom Whispers */}
      <WisdomWhispers />
      
      {/* Ethereal Particles */}
      <EtherealParticles />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[15, 64]} />
        <meshStandardMaterial
          color="#0a0a15"
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      
      {/* Ambient Lights */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 15, 0]} color="#ff00ff" intensity={0.5} distance={50} />
    </group>
  );
}
