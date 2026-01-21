import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, Environment, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';

// Sacred Stone Portal
function SacredPortal() {
  const portalRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 
        0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group ref={portalRef}>
      {/* Main Portal Structure - Obsidian Stone */}
      <mesh position={[0, 3, -5]}>
        <torusGeometry args={[3, 0.5, 16, 100]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.2}
          metalness={0.8}
          emissive="#00d4ff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Inner Light Portal */}
      <mesh ref={glowRef} position={[0, 3, -5]}>
        <circleGeometry args={[2.5, 64]} />
        <meshStandardMaterial 
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ceremonial Pillars */}
      {[-4, 4].map((x, i) => (
        <group key={i} position={[x, 0, -6]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 6, 8]} />
            <meshStandardMaterial 
              color="#2d2d44"
              roughness={0.3}
              metalness={0.7}
              emissive="#d4af37"
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Gold Cap */}
          <mesh position={[0, 6.2, 0]}>
            <coneGeometry args={[0.5, 0.8, 8]} />
            <meshStandardMaterial 
              color="#d4af37"
              roughness={0.2}
              metalness={0.9}
              emissive="#d4af37"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Water-Data Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0a0a1a"
          roughness={0.1}
          metalness={0.9}
          emissive="#00d4ff"
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  );
}

// Floating Sacred Text
function FloatingDedication() {
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
      <Center position={[0, 1, -3]}>
        <Text3D
          font="/fonts/optimer_regular.typeface.json"
          size={0.3}
          height={0.05}
          curveSegments={12}
        >
          REINA TREJO SERRANO
          <meshStandardMaterial 
            color="#d4af37"
            emissive="#d4af37"
            emissiveIntensity={0.5}
          />
        </Text3D>
      </Center>
    </Float>
  );
}

interface WorldEntryGateProps {
  onEnter: () => void;
  acknowledged: boolean;
}

export function WorldEntryGate({ onEnter, acknowledged }: WorldEntryGateProps) {
  const [step, setStep] = useState<'intro' | 'dedication' | 'acknowledgment'>('intro');
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  const handleAcknowledge = async () => {
    setIsAcknowledging(true);
    // Simulate acknowledgment registration
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep('acknowledgment');
    setTimeout(() => {
      onEnter();
    }, 3000);
  };

  if (acknowledged) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 10, 0]} intensity={1} color="#00d4ff" />
        <pointLight position={[0, 3, -5]} intensity={2} color="#d4af37" />
        <spotLight position={[0, 15, 5]} angle={0.3} penumbra={1} intensity={0.5} />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <SacredPortal />
        <Environment preset="night" />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center max-w-2xl mx-auto px-6 pointer-events-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary"
              >
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="font-display text-3xl md:text-5xl font-bold mb-4 text-gradient-aurora"
              >
                PUERTA DE ORIGEN
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-lg text-muted-foreground mb-8"
              >
                Estás por entrar a TAMV, la primera civilización digital soberana.
                <br />
                Antes de continuar, conocerás el origen de todo.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <Button
                  size="lg"
                  className="bg-aurora text-primary-foreground font-display glow-primary"
                  onClick={() => setStep('dedication')}
                >
                  Continuar al Acto Fundacional
                </Button>
              </motion.div>
            </motion.div>
          )}

          {step === 'dedication' && (
            <motion.div
              key="dedication"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center max-w-3xl mx-auto px-6 pointer-events-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center glow-gold"
              >
                <Heart className="w-8 h-8 text-background fill-current" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-2xl md:text-4xl font-bold mb-6 text-gradient-gold"
              >
                DEDICATORIA
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-2xl p-8 mb-8 border border-gold/20"
              >
                <p className="text-xl md:text-2xl font-display text-gold mb-4">
                  A Reina Trejo Serrano
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Mujer de hierro. Pilar invisible. Origen de todo.
                </p>
                <p className="text-sm text-muted-foreground/80 italic leading-relaxed">
                  Una mujer que soportó golpes durante décadas. Que conoció el dolor antes que el descanso. 
                  Que fue quebrada por la vida muchas veces, pero jamás doblada.
                  <br /><br />
                  Este sistema, esta civilización, este mundo… existen porque ella resistió.
                  <br /><br />
                  TAMV Online lleva su nombre en silencio, inscrito en cada capa invisible del sistema, 
                  como homenaje eterno a una mujer que enseñó que la dignidad no se negocia, se encarna.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Al continuar, reconoces el origen sagrado de esta civilización.
                  <br />
                  Este acto quedará registrado en MSR y BookPI.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-gold to-amber-600 text-background font-display glow-gold"
                  onClick={handleAcknowledge}
                  disabled={isAcknowledging}
                >
                  {isAcknowledging ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      Registrando en MSR...
                    </span>
                  ) : (
                    'Reconocer y Entrar a TAMV'
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {step === 'acknowledgment' && (
            <motion.div
              key="acknowledgment"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-xl mx-auto px-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-cyber-green flex items-center justify-center glow-primary"
              >
                <Sparkles className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              
              <h2 className="font-display text-3xl font-bold mb-4 text-gradient-aurora">
                Bienvenido, Ciudadano
              </h2>
              <p className="text-muted-foreground">
                Tu acto fundacional ha sido registrado.
                <br />
                Ahora eres parte de la historia de TAMV.
              </p>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
                className="h-1 bg-aurora rounded-full mt-8"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
