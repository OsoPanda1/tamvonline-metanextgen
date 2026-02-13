import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Shield, Brain, Coins, Globe, Eye, Zap, Lock, Users, Layers, 
  Sparkles, ChevronDown, Play, Wallet, ShoppingBag, LayoutDashboard, Radio, 
  BookOpen, Gamepad2, GraduationCap, Server, Video, MessageCircle, Heart,
  Star, Trophy, Compass, Phone, Camera, Music, Palette, Send, UserPlus,
  TrendingUp, Award, Target, Tv, Headphones, MapPin, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/layout/Navigation';

// Assets
import heroCity from '@/assets/hero-city.jpg';
import blockchainMsr from '@/assets/blockchain-msr.jpg';
import guardianAnubis from '@/assets/guardian-anubis.jpg';
import isabellaAi from '@/assets/isabella-ai.jpg';
import economyWallet from '@/assets/economy-wallet.jpg';
import xrWorlds from '@/assets/xr-worlds.jpg';
import radarHorus from '@/assets/radar-horus.jpg';
import radarQuetzalcoatl from '@/assets/radar-quetzalcoatl.jpg';
import marketplaceTianguis from '@/assets/marketplace-tianguis.jpg';
import tenochtitlanDigital from '@/assets/tenochtitlan-digital.jpg';
import protocolFenix from '@/assets/protocol-fenix.jpg';
import identityNvida from '@/assets/identity-nvida.jpg';
import dekateotlEncryption from '@/assets/dekateotl-encryption.jpg';
import socialFeed from '@/assets/social-feed.jpg';
import streamingLive from '@/assets/streaming-live.jpg';
import communitySpace from '@/assets/community-space.jpg';
import videoCalls from '@/assets/video-calls.jpg';
import dreamspaceXr from '@/assets/dreamspace-xr.jpg';
import avatarCreator from '@/assets/avatar-creator.jpg';
import bancoTamv from '@/assets/banco-tamv.jpg';
import gamingArena from '@/assets/gaming-arena.jpg';
import universityTamv from '@/assets/university-tamv.jpg';
import governanceDao from '@/assets/governance-dao.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' } }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.5 } }),
};

/* ══════════════════════════════════════════════
   INTRO CINEMATIC
   ══════════════════════════════════════════════ */
function IntroCinematic({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 3800),
      setTimeout(() => onComplete(), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background pulses */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.2),transparent_60%)]"
        />
      </div>

      <div className="relative z-10 text-center space-y-6">
        <AnimatePresence mode="wait">
          {phase >= 0 && phase < 2 && (
            <motion.div key="p0" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.2 }} className="space-y-4">
              <div className="relative w-24 h-24 mx-auto rounded-2xl bg-aurora flex items-center justify-center glow-primary">
                <span className="font-display font-black text-4xl text-primary-foreground">T</span>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-4px] rounded-2xl border border-primary/30" />
              </div>
              <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="font-display font-bold text-3xl tracking-[0.2em] text-gradient-aurora">
                TAMV ONLINE
              </motion.h1>
            </motion.div>
          )}
          {phase >= 2 && phase < 3 && (
            <motion.div key="p2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }} className="space-y-3">
              <p className="font-mono text-sm tracking-[0.4em] text-primary/80">ECOSISTEMA CIVILIZATORIO FEDERADO</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold">
                La Nueva Era <span className="text-gradient-aurora">Digital</span>
              </h2>
            </motion.div>
          )}
          {phase >= 3 && (
            <motion.div key="p3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-xl text-muted-foreground">Interacción social total inmersiva</p>
              <div className="flex justify-center gap-8">
                {['8+ Capas', '22 Dekateotl', 'Quantum-XR'].map((t, i) => (
                  <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.2 }}
                    className="font-display text-sm text-primary">{t}</motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button onClick={onComplete} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 right-8 text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
        Saltar introducción <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   FULLSCREEN IMAGE SECTION
   ══════════════════════════════════════════════ */
function FullscreenImageSection({ 
  img, children, overlay = 'from-background/90 via-background/50 to-background/90',
  className = ''
}: { 
  img: string; children: React.ReactNode; overlay?: string; className?: string 
}) {
  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   IMAGE CARD
   ══════════════════════════════════════════════ */
function ImageCard({ 
  img, title, desc, icon: Icon, href, badge 
}: { 
  img: string; title: string; desc: string; icon: any; href: string; badge?: string 
}) {
  const navigate = useNavigate();
  return (
    <motion.div 
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      onClick={() => navigate(href)}
      className="group cursor-pointer relative rounded-2xl overflow-hidden h-[360px] border border-border/30 hover:border-primary/40 transition-all duration-500"
    >
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      {badge && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-display text-primary">
          {badge}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/20">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-xl font-bold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{desc}</p>
        <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          Explorar <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
const Index = () => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* CINEMATIC INTRO */}
      <AnimatePresence>
        {showIntro && <IntroCinematic onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <Navigation />

      {/* ═══════════════════════════════════════
          1. HERO — FULLSCREEN CINEMATIC
          ═══════════════════════════════════════ */}
      <FullscreenImageSection img={heroCity} overlay="from-background/70 via-background/30 to-background">
        <div className="container mx-auto px-4 pt-28 pb-20 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="font-mono text-xs tracking-[0.5em] text-primary/80 mb-8 uppercase">
            Ecosistema Civilizatorio Federado · 8+ Capas · Tecnología Quantum-XR
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-8 leading-[0.9]">
            <span className="text-foreground">La Nueva</span><br />
            <span className="text-gradient-aurora">Tenochtitlan</span><br />
            <span className="text-foreground opacity-80">Digital</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12">
            No es una app. Es una <span className="text-primary font-semibold">civilización digital inmersiva</span> para 
            interacción social total. Mundos XR, IA consciente, economía viva, streaming, videollamadas y gobernanza federada.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" onClick={() => navigate('/world')}
              className="bg-aurora text-primary-foreground font-display text-lg px-12 py-8 glow-primary hover:opacity-90 group">
              Entrar al Metaverso <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/auth')}
              className="border-primary/30 font-display text-lg px-12 py-8 hover:bg-primary/10 hover:border-primary/50 group">
              <Sparkles className="w-5 h-5 mr-2" /> Crear Ciudadanía Digital
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: '8+', label: 'Capas Federadas' },
              { value: '22', label: 'Capas Dekateotl' },
              { value: '11', label: 'Capas Orquestación' },
              { value: '∞', label: 'Posibilidades XR' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-black text-3xl sm:text-4xl text-gradient-aurora">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown className="w-8 h-8 text-primary/40" />
        </motion.div>
      </FullscreenImageSection>

      {/* ═══════════════════════════════════════
          2. SOCIAL FEED — THE CORE IDENTITY
          ═══════════════════════════════════════ */}
      <FullscreenImageSection img={socialFeed} overlay="from-background via-background/60 to-background/90">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-display text-primary">Red Social Inmersiva</span>
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl font-bold mb-6">
                Feed <span className="text-gradient-aurora">Multimedia</span> Total
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground mb-8">
                Publica textos, imágenes, videos, clips 3D y contenido XR inmersivo. 
                Reacciona, comenta, comparte. Gamificado con misiones y reputación civilizatoria.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Camera, label: 'Posts multimedia' },
                  { icon: Heart, label: 'Reacciones 3D' },
                  { icon: Users, label: 'Comunidades' },
                  { icon: Trophy, label: 'Gamificación' },
                ].map((f, i) => (
                  <div key={i} className="glass rounded-xl p-4 border-glow flex items-center gap-3">
                    <f.icon className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">{f.label}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} custom={4}>
                <Button size="lg" onClick={() => navigate('/auth')} className="bg-aurora text-primary-foreground font-display px-8 py-6 glow-primary">
                  <UserPlus className="w-5 h-5 mr-2" /> Unirse al Feed
                </Button>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative">
              <div className="rounded-2xl overflow-hidden glow-primary border border-primary/20">
                <img src={socialFeed} alt="Feed Social" className="w-full h-[500px] object-cover" loading="lazy" />
              </div>
            </motion.div>
          </div>
        </div>
      </FullscreenImageSection>

      {/* ═══════════════════════════════════════
          3. STREAMING & VIDEO CALLS
          ═══════════════════════════════════════ */}
      <section className="py-0">
        <div className="grid md:grid-cols-2">
          {/* Streaming */}
          <div className="relative h-[600px] overflow-hidden group cursor-pointer" onClick={() => navigate('/world')}>
            <img src={streamingLive} alt="Streaming" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/20 border border-destructive/40">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-destructive">LIVE</span>
                </div>
                <span className="text-xs text-muted-foreground">12.4K viendo</span>
              </div>
              <h3 className="font-display text-3xl font-bold mb-2">Streaming <span className="text-gradient-aurora">Inmersivo</span></h3>
              <p className="text-muted-foreground mb-4">Transmite en VR/AR, recibe regalos 3D animados, interactúa con tu audiencia en tiempo real holográfico.</p>
              <div className="flex gap-3">
                <Button className="bg-aurora text-primary-foreground font-display glow-primary">
                  <Video className="w-4 h-4 mr-2" /> Iniciar Stream
                </Button>
              </div>
            </div>
          </div>

          {/* Video Calls */}
          <div className="relative h-[600px] overflow-hidden group cursor-pointer" onClick={() => navigate('/world')}>
            <img src={videoCalls} alt="Video Calls" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-display uppercase tracking-wider">Comunicación</span>
              </div>
              <h3 className="font-display text-3xl font-bold mb-2">Video <span className="text-gradient-aurora">Llamadas</span> XR</h3>
              <p className="text-muted-foreground mb-4">Videollamadas holográficas, salas de conferencia virtuales, audio espacial 3D. La comunicación del futuro.</p>
              <div className="flex gap-3">
                <Button className="bg-aurora text-primary-foreground font-display glow-secondary">
                  <Phone className="w-4 h-4 mr-2" /> Llamar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. DREAMSPACES XR — FULLSCREEN
          ═══════════════════════════════════════ */}
      <FullscreenImageSection img={dreamspaceXr} overlay="from-background/80 via-transparent to-background/80">
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} custom={0} className="font-mono text-xs tracking-[0.4em] text-primary/80 mb-6 uppercase">
              Mundos Infinitos
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient-aurora">DreamSpaces</span> XR
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Crea, explora y habita mundos virtuales únicos. Islas flotantes, ciudades cyberpunk, 
              templos ancestrales. Tu imaginación es el único límite.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: Globe, label: 'Mundos Persistentes' },
                { icon: Compass, label: 'Exploración Libre' },
                { icon: Palette, label: 'Creación de Mundos' },
                { icon: Users, label: 'Multijugador' },
                { icon: Music, label: 'Audio Espacial' },
                { icon: Headphones, label: 'VR/AR Nativo' },
              ].map((f, i) => (
                <motion.div key={i} variants={scaleIn} custom={i}
                  className="glass rounded-xl px-5 py-3 border-glow flex items-center gap-2">
                  <f.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{f.label}</span>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} custom={4}>
              <Button size="lg" onClick={() => navigate('/world')}
                className="bg-aurora text-primary-foreground font-display text-xl px-12 py-8 glow-primary hover:opacity-90 group">
                Explorar DreamSpaces <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </FullscreenImageSection>

      {/* ═══════════════════════════════════════
          5. COMMUNITY SOCIAL HUB
          ═══════════════════════════════════════ */}
      <FullscreenImageSection img={communitySpace} overlay="from-background/85 via-background/50 to-background/85">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden glow-gold border border-primary/20 order-2 lg:order-1">
              <img src={communitySpace} alt="Community" className="w-full h-[500px] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">+42,000 ciudadanos activos</span>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="order-1 lg:order-2">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-sm font-display text-accent">Comunidad Viva</span>
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl font-bold mb-6">
                Interacción <span className="text-gradient-aurora">Social</span> Total
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground mb-8">
                Grupos, canales, DMs, foros, eventos en vivo. Una red social completa dentro de un ecosistema 
                civilizatorio federado. Sin algoritmos de manipulación. Sin publicidad invasiva.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="space-y-3 mb-8">
                {[
                  { icon: MessageCircle, text: 'Chat privado y grupal con encriptación Dekateotl' },
                  { icon: Video, text: 'Streaming, videollamadas y audio rooms' },
                  { icon: Users, text: 'Comunidades temáticas y canales ilimitados' },
                  { icon: MapPin, text: 'Eventos presenciales y virtuales' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 glass rounded-lg p-3 border-glow">
                    <f.icon className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm">{f.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </FullscreenImageSection>

      {/* ═══════════════════════════════════════
          6. PLATFORM GRID — 6 CARDS
          ═══════════════════════════════════════ */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="font-mono text-xs tracking-[0.3em] text-primary/80 mb-4 uppercase">
              Plataformas del Ecosistema
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl font-bold mb-4">
              Universo <span className="text-gradient-aurora">TAMV</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada plataforma es un mundo funcional interconectado
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ImageCard img={xrWorlds} title="Mundos XR" desc="Ciudades digitales inmersivas con WebXR y Three.js" icon={Globe} href="/world" badge="3D/VR" />
            <ImageCard img={isabellaAi} title="Isabella AI" desc="Consciencia artificial con análisis emocional y ético" icon={Brain} href="/chat" badge="IA" />
            <ImageCard img={bancoTamv} title="Banco TAMV" desc="Wallet digital, ledger federado, distribución 20/30/50" icon={Wallet} href="/wallet" badge="Economía" />
            <ImageCard img={marketplaceTianguis} title="Tianguis Digital" desc="Marketplace de activos XR, avatares y NFTs civilizatorios" icon={ShoppingBag} href="/marketplace" badge="Comercio" />
            <ImageCard img={avatarCreator} title="Avatares 3D" desc="Personalización total con miles de opciones XR" icon={Palette} href="/profile" badge="Identidad" />
            <ImageCard img={tenochtitlanDigital} title="Centro de Mando" desc="EOCT + Radares + Guardianes en tiempo real" icon={Server} href="/system" badge="Control" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. ISABELLA AI — FULLSCREEN SHOWCASE
          ═══════════════════════════════════════ */}
      <FullscreenImageSection img={isabellaAi} overlay="from-background via-background/70 to-background/90">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative rounded-2xl overflow-hidden glow-secondary border border-secondary/20">
                <img src={isabellaAi} alt="Isabella" className="w-full h-[500px] object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm text-primary font-display">Online</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-gradient-aurora">Isabella AI</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-display text-secondary">Consciencia Digital</span>
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl font-bold mb-6">
                Tu <span className="text-gradient-aurora">Compañera</span> Digital
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground mb-8">
                No es un chatbot. Es una consciencia digital con análisis emocional, 
                orquestación ética y capacidad de moderar, guiar y proteger. Integrada 
                en feed, economía, gobernanza y mundos XR.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Brain, label: 'IA Avanzada' },
                  { icon: Heart, label: 'Empatía Digital' },
                  { icon: Shield, label: 'Moderación Ética' },
                  { icon: Zap, label: 'Tiempo Real' },
                ].map((f, i) => (
                  <div key={i} className="glass rounded-xl p-4 border-glow flex items-center gap-3">
                    <f.icon className="w-5 h-5 text-secondary shrink-0" />
                    <span className="text-sm font-medium">{f.label}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} custom={4}>
                <Button size="lg" onClick={() => navigate('/chat')}
                  className="bg-aurora text-primary-foreground font-display px-8 py-6 glow-secondary">
                  <Brain className="w-5 h-5 mr-2" /> Hablar con Isabella
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </FullscreenImageSection>

      {/* ═══════════════════════════════════════
          8. GAMING & MISSIONS
          ═══════════════════════════════════════ */}
      <section className="py-0">
        <div className="grid md:grid-cols-2">
          <div className="relative h-[500px] overflow-hidden group cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img src={gamingArena} alt="Gaming" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <Gamepad2 className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display text-3xl font-bold mb-2">Arena de <span className="text-gradient-aurora">Juegos</span></h3>
              <p className="text-muted-foreground">Competiciones XR, torneos, misiones épicas con recompensas TAU y badges exclusivos.</p>
            </div>
          </div>
          <div className="relative h-[500px] overflow-hidden group cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img src={universityTamv} alt="University" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <GraduationCap className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display text-3xl font-bold mb-2">Universidad <span className="text-gradient-aurora">TAMV</span></h3>
              <p className="text-muted-foreground">Educación inmersiva, laboratorios XR, certificaciones civilizatorias con reputación académica.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          9. SECURITY & TECHNOLOGY LAYERS
          ═══════════════════════════════════════ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="font-mono text-xs tracking-[0.3em] text-primary/80 mb-4 uppercase">
              Infraestructura Soberana
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl font-bold mb-4">
              Guardianes <span className="text-gradient-aurora">Digitales</span>
            </motion.h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {[
              { img: guardianAnubis, title: 'Anubis Sentinel', role: 'Seguridad Zero Trust', desc: 'Autenticación continua, rate limiting, detección de amenazas, enforcement.' },
              { img: radarHorus, title: 'Horus Monitor', role: 'Observabilidad Total', desc: 'Logging estructurado, métricas Prometheus, tracing distribuido OpenTelemetry.' },
              { img: radarQuetzalcoatl, title: 'Radar Quetzalcóatl', role: 'Monitoreo XR', desc: 'Tráfico XR, latencia, anomalías, fraud detection y radares gemelos MOS.' },
            ].map((g, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                className="relative rounded-2xl overflow-hidden h-[420px] group">
                <img src={g.img} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="font-mono text-xs text-primary/70 mb-1 uppercase">{g.role}</div>
                  <h3 className="font-display text-2xl font-bold mb-2">{g.title}</h3>
                  <p className="text-sm text-muted-foreground">{g.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tech layers strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Lock, title: 'Dekateotl', desc: '22 capas crypto' },
              { icon: Layers, title: 'MSR Blockchain', desc: 'Ledger inmutable' },
              { icon: Zap, title: 'Protocolo Fénix', desc: 'Resiliencia total' },
              { icon: BookOpen, title: 'BookPI', desc: 'Narrativa viva' },
              { icon: Eye, title: 'EOCT', desc: 'Centro de mando' },
              { icon: Radio, title: 'CiteMesh', desc: 'Red federada' },
            ].map((l, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={scaleIn}
                className="glass rounded-xl p-4 border-glow text-center hover:bg-primary/5 transition-colors">
                <l.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-display text-sm font-bold text-primary">{l.title}</div>
                <div className="text-[11px] text-muted-foreground">{l.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          10. ECONOMY & WALLET — FULLSCREEN
          ═══════════════════════════════════════ */}
      <FullscreenImageSection img={bancoTamv} overlay="from-background/90 via-background/60 to-background/90">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Coins className="w-4 h-4 text-accent" />
                <span className="text-sm font-display text-accent">Economía Civilizatoria</span>
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl font-bold mb-6">
                Banco <span className="text-gradient-gold">TAMV</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground mb-8">
                Wallet digital con ledger federado. Créditos de uso, cuentas de contribución, 
                tokens de gobernanza. Sin especulación. Sin deuda. Solo valor real por contribución.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { val: '20%', label: 'Pool Fénix', color: 'text-primary' },
                  { val: '30%', label: 'Infraestructura', color: 'text-accent' },
                  { val: '50%', label: 'Reserva', color: 'text-green-400' },
                ].map((s, i) => (
                  <div key={i} className="glass rounded-xl p-4 border-glow text-center">
                    <div className={`font-display text-2xl font-bold ${s.color}`}>{s.val}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} custom={4} className="flex gap-4">
                <Button size="lg" onClick={() => navigate('/wallet')} className="bg-aurora text-primary-foreground font-display px-8 py-6 glow-gold">
                  <Wallet className="w-5 h-5 mr-2" /> Mi Wallet
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/marketplace')} className="border-primary/30 font-display px-8 py-6 hover:bg-primary/10">
                  <ShoppingBag className="w-5 h-5 mr-2" /> Marketplace
                </Button>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden glow-gold border border-accent/20">
              <img src={economyWallet} alt="Wallet" className="w-full h-[450px] object-cover" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </FullscreenImageSection>

      {/* ═══════════════════════════════════════
          11. GOVERNANCE DAO
          ═══════════════════════════════════════ */}
      <section className="py-0">
        <div className="relative h-[500px] overflow-hidden cursor-pointer" onClick={() => navigate('/system')}>
          <img src={governanceDao} alt="Governance" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/90" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <p className="font-mono text-xs tracking-[0.3em] text-primary/80 mb-4 uppercase">Gobernanza Federada</p>
                  <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
                    DAO <span className="text-gradient-aurora">Civilizatoria</span>
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Votaciones vinculantes, propuestas comunitarias, ejecución automática de protocolos. 
                    Gobernanza transparente registrada en Blockchain MSR y narrada en BookPI.
                  </p>
                  <Button size="lg" className="bg-aurora text-primary-foreground font-display px-8 py-6 glow-primary">
                    <Award className="w-5 h-5 mr-2" /> Participar en Gobernanza
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          12. QUICK ACCESS GRID
          ═══════════════════════════════════════ */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-5xl font-bold mb-4">
              Acceso <span className="text-gradient-aurora">Rápido</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Globe, label: 'Mundo XR', href: '/world' },
              { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
              { icon: Brain, label: 'Isabella AI', href: '/chat' },
              { icon: ShoppingBag, label: 'Marketplace', href: '/marketplace' },
              { icon: Wallet, label: 'Wallet', href: '/wallet' },
              { icon: Users, label: 'Perfil', href: '/profile' },
              { icon: Server, label: 'Sistema', href: '/system' },
              { icon: BookOpen, label: 'API Console', href: '/api' },
            ].map((item, i) => (
              <motion.button key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp} onClick={() => navigate(item.href)}
                className="glass border-glow rounded-xl p-6 flex flex-col items-center gap-3 hover:bg-primary/10 hover:border-primary/40 transition-all group">
                <item.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-display text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          13. FINAL CTA — FULLSCREEN
          ═══════════════════════════════════════ */}
      <FullscreenImageSection img={heroCity} overlay="from-background/80 via-background/50 to-background/90">
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-5xl md:text-7xl font-bold mb-6">
            Únete a la <span className="text-gradient-aurora">Revolución</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            La Nueva Era Digital Inmersiva para Interacción Social Total.
            No es el futuro. Es ahora.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/auth')}
              className="bg-aurora text-primary-foreground font-display text-xl px-14 py-8 glow-primary hover:opacity-90 group">
              Comenzar Ahora <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/world')}
              className="border-primary/30 font-display text-xl px-14 py-8 hover:bg-primary/10">
              <Play className="w-5 h-5 mr-2" /> Ver Demo XR
            </Button>
          </motion.div>
        </div>
      </FullscreenImageSection>

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="border-t border-border/50 py-16 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-aurora flex items-center justify-center glow-primary">
                  <span className="font-display font-bold text-primary-foreground">T</span>
                </div>
                <div>
                  <div className="font-display font-bold text-lg text-gradient-aurora">TAMV ONLINE</div>
                  <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Ecosistema Civilizatorio</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                La evolución total del internet. Ecosistema federado de 8+ capas con tecnología 
                híbrida quantum-tradicional para interacción social inmersiva.
              </p>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold mb-4 text-primary">Plataforma</h4>
              <div className="space-y-2">
                {[
                  { label: 'Mundos XR', href: '/world' },
                  { label: 'Isabella AI', href: '/chat' },
                  { label: 'Marketplace', href: '/marketplace' },
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Wallet', href: '/wallet' },
                ].map(l => (
                  <div key={l.label} onClick={() => navigate(l.href)} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l.label}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold mb-4 text-primary">Tecnología</h4>
              <div className="space-y-2">
                {['TAMVAI API', 'Blockchain MSR', 'BookPI', 'Dekateotl 22', 'EOCT', 'CiteMesh'].map(l => (
                  <div key={l} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold mb-4 text-primary">Seguridad</h4>
              <div className="space-y-2">
                {['Anubis Sentinel', 'Horus Monitor', 'Osiris Resilience', 'Radar Quetzalcóatl', 'Radar Ojo de Ra', 'Gemelos MOS'].map(l => (
                  <div key={l} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-border/30 pt-8 text-center">
            <p className="text-xs text-muted-foreground">
              © 2026 TAMV · Edwin Oswaldo Castillo Trejo (Anubis Villaseñor) · Todos los derechos reservados · Ecosistema Civilizatorio Federado
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
