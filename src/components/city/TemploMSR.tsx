import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { supabase } from '@/integrations/supabase/client';

// MSR Event Block (Floating inscription)
interface MSREventProps {
  position: [number, number, number];
  event: {
    id: string;
    act_type: string;
    description: string | null;
    created_at: string;
  };
  delay: number;
}

function MSREventBlock({ position, event, delay }: MSREventProps) {
  const blockRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (blockRef.current) {
      blockRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.2;
      blockRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={[position[0], position[1], position[2]]}>
      <mesh
        ref={blockRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshStandardMaterial
          color={hovered ? "#00d4ff" : "#1a1a2e"}
          emissive="#00d4ff"
          emissiveIntensity={hovered ? 0.5 : 0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {hovered && (
        <Html center position={[0, 1, 0]}>
          <div className="bg-card/95 backdrop-blur-md px-4 py-2 rounded-lg border border-primary/30 text-center min-w-[200px]">
            <p className="text-xs text-primary font-display">{event.act_type}</p>
            <p className="text-xs text-muted-foreground">{event.description || 'Registro MSR'}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              {new Date(event.created_at).toLocaleDateString()}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Main Pyramid Temple
function MainPyramid() {
  const pyramidRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pyramidRef.current) {
      // Subtle breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
      pyramidRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={pyramidRef} position={[0, 0, 0]}>
      {/* Pyramid Tiers */}
      {[0, 1, 2, 3, 4].map((tier) => (
        <mesh key={tier} position={[0, tier * 2, 0]}>
          <boxGeometry args={[20 - tier * 3, 2, 20 - tier * 3]} />
          <meshStandardMaterial
            color="#0f0f1a"
            roughness={0.3}
            metalness={0.8}
            emissive="#00d4ff"
            emissiveIntensity={0.05 + tier * 0.02}
          />
        </mesh>
      ))}
      
      {/* Apex Shrine */}
      <mesh position={[0, 11, 0]}>
        <octahedronGeometry args={[2]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Apex Light */}
      <pointLight position={[0, 13, 0]} color="#00d4ff" intensity={3} distance={50} />

      {/* Wall Inscriptions (Circuit Patterns) */}
      {[0, 1, 2, 3].map((side) => (
        <mesh
          key={side}
          position={[
            Math.sin((side * Math.PI) / 2) * 10,
            4,
            Math.cos((side * Math.PI) / 2) * 10
          ]}
          rotation={[0, (side * Math.PI) / 2, 0]}
        >
          <planeGeometry args={[8, 6]} />
          <meshStandardMaterial
            color="#001a33"
            emissive="#00d4ff"
            emissiveIntensity={0.1}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Memory Chamber (Internal Room)
function MemoryChamber() {
  const [registryEvents, setRegistryEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchRegistry = async () => {
      const { data } = await supabase
        .from('registry')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) setRegistryEvents(data);
    };
    
    fetchRegistry();
  }, []);

  return (
    <group position={[0, 2, 0]}>
      {/* Chamber Walls */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[6, 6, 6, 8, 1, true]} />
        <meshStandardMaterial
          color="#0a0a15"
          side={THREE.DoubleSide}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floating Registry Blocks */}
      {registryEvents.map((event, i) => {
        const angle = (i / registryEvents.length) * Math.PI * 2;
        const radius = 4;
        const height = 2 + (i % 3) * 0.5;
        
        return (
          <MSREventBlock
            key={event.id}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
            event={event}
            delay={i * 0.5}
          />
        );
      })}
    </group>
  );
}

// Vault Entrance
function VaultEntrance() {
  const doorRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (doorRef.current) {
      (doorRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 
        0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={[0, 0, -10]}>
      {/* Door Frame */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[4, 5, 0.5]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Door */}
      <mesh ref={doorRef} position={[0, 2, 0.3]}>
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial
          color="#0a0a15"
          emissive="#d4af37"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
      
      {/* Door Light */}
      <pointLight position={[0, 3, 1]} color="#d4af37" intensity={0.5} distance={10} />
    </group>
  );
}

export function TemploMSR() {
  return (
    <group>
      {/* Main Temple Structure */}
      <MainPyramid />
      
      {/* Memory Chamber */}
      <MemoryChamber />
      
      {/* Vault Entrances */}
      <VaultEntrance />
      
      {/* Ambient Particles */}
      <Float speed={0.5} rotationIntensity={0} floatIntensity={1}>
        {[...Array(30)].map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 30,
              Math.random() * 15 + 2,
              (Math.random() - 0.5) * 30
            ]}
          >
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#00d4ff" />
          </mesh>
        ))}
      </Float>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#050510"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}
