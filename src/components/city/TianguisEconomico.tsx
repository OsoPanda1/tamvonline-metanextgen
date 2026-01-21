import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { supabase } from '@/integrations/supabase/client';

// Market Stall
interface MarketStallProps {
  position: [number, number, number];
  item?: {
    id: string;
    name: string;
    price: number;
    category: string;
    rarity: string | null;
  };
}

function MarketStall({ position, item }: MarketStallProps) {
  const stallRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const rarityColors: Record<string, string> = {
    common: '#888888',
    uncommon: '#00ff88',
    rare: '#00d4ff',
    epic: '#ff00ff',
    legendary: '#d4af37'
  };

  const color = item?.rarity ? rarityColors[item.rarity] || '#00d4ff' : '#00d4ff';

  return (
    <group ref={stallRef} position={position}>
      {/* Stall Base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 1, 2]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Display Platform */}
      <mesh 
        position={[0, 1.2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshStandardMaterial
          color="#0f0f1a"
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Item Hologram */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh position={[0, 2, 0]}>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
      
      {/* Item Light */}
      <pointLight position={[0, 2, 0]} color={color} intensity={0.5} distance={5} />
      
      {/* Price Tag */}
      {item && hovered && (
        <Html center position={[0, 3.5, 0]}>
          <div className="bg-card/95 backdrop-blur-md px-4 py-2 rounded-lg border border-primary/30 text-center min-w-[150px]">
            <p className="font-display text-sm" style={{ color }}>{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.category}</p>
            <p className="text-gold font-bold mt-1">τ {item.price}</p>
            {item.rarity && (
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
                {item.rarity.toUpperCase()}
              </span>
            )}
          </div>
        </Html>
      )}
      
      {/* Canopy */}
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[2, 1.5, 4]} />
        <meshStandardMaterial
          color="#2d2d44"
          roughness={0.5}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

// Central Auction Platform
function AuctionPlatform() {
  const platformRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.rotation.y += 0.02;
      (beamRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 
        0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Platform */}
      <mesh ref={platformRef} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[6, 7, 1, 8]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.2}
          metalness={0.8}
          emissive="#d4af37"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Energy Beam */}
      <mesh ref={beamRef} position={[0, 8, 0]}>
        <cylinderGeometry args={[0.1, 2, 15, 32, 1, true]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Top Light */}
      <pointLight position={[0, 15, 0]} color="#d4af37" intensity={2} distance={40} />
      
      {/* Platform Steps */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -0.3 - i * 0.3, 0]}>
          <cylinderGeometry args={[7 + i * 0.5, 7.5 + i * 0.5, 0.3, 8]} />
          <meshStandardMaterial
            color="#0f0f1a"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// Gift Offering Area
function GiftArea() {
  const gifts = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gifts.current) {
      gifts.current.children.forEach((child, i) => {
        child.position.y = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3;
        child.rotation.y += 0.01;
      });
    }
  });

  return (
    <group position={[15, 0, 0]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[6, 0.5, 6]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#ff00ff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <group ref={gifts}>
        {[...Array(4)].map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 2, 1, Math.sin(angle) * 2]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial
                color="#ff00ff"
                emissive="#ff00ff"
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </group>
      
      <pointLight position={[0, 3, 0]} color="#ff00ff" intensity={1} distance={15} />
    </group>
  );
}

// Lottery Ceremonial Area
function LotteryCeremony() {
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += 0.02;
      orbRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group position={[-15, 0, 0]}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[4, 4, 0.5, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#00ff88"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Lottery Orb */}
      <mesh ref={orbRef} position={[0, 3, 0]}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.4}
          wireframe
        />
      </mesh>
      
      <pointLight position={[0, 3, 0]} color="#00ff88" intensity={1} distance={15} />
    </group>
  );
}

export function TianguisEconomico() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('is_listed', true)
        .limit(12);
      
      if (data) setItems(data);
    };
    
    fetchItems();
  }, []);

  // Stall positions in a semicircle around the auction platform
  const stallPositions: [number, number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = ((i / 5) * Math.PI) - Math.PI / 2;
    const radius = 15;
    stallPositions.push([
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius - 10
    ]);
  }

  return (
    <group>
      {/* Central Auction Platform */}
      <AuctionPlatform />
      
      {/* Market Stalls */}
      {stallPositions.map((pos, i) => (
        <MarketStall key={i} position={pos} item={items[i]} />
      ))}
      
      {/* Gift Offering Area */}
      <GiftArea />
      
      {/* Lottery Ceremony */}
      <LotteryCeremony />
      
      {/* Ground - Market Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color="#0a0a15"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      {/* Decorative Lanterns */}
      {[...Array(20)].map((_, i) => {
        const x = (Math.random() - 0.5) * 60;
        const z = (Math.random() - 0.5) * 60;
        return (
          <pointLight
            key={i}
            position={[x, 8, z]}
            color={Math.random() > 0.5 ? "#d4af37" : "#00d4ff"}
            intensity={0.2}
            distance={10}
          />
        );
      })}
    </group>
  );
}
