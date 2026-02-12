import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Brain, Coins, Globe, Eye, Zap, Lock, Users, Layers, Sparkles, ChevronDown, Play, Wallet, ShoppingBag, LayoutDashboard, Radio, BookOpen, Gamepad2, GraduationCap, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/layout/Navigation';

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

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: 'easeOut' } }),
};

const stats = [
  { value: '8+', label: 'Capas Federadas' },
  { value: '22', label: 'Capas Dekateotl' },
  { value: '11', label: 'Capas Orquestación' },
  { value: '∞', label: 'Posibilidades' },
];

const ecosystemLayers = [
  { icon: Lock, title: 'DEKATEOTL', desc: '22 capas de encriptación con criptografía quantum-tradicional', img: dekateotlEncryption, color: 'from-yellow-500/20' },
  { icon: Shield, title: 'ANUBIS Sentinel', desc: 'Sistema de seguridad Zero Trust con autenticación continua', img: guardianAnubis, color: 'from-cyan-500/20' },
  { icon: Eye, title: 'HORUS Monitor', desc: 'Observabilidad total con métricas, tracing y dashboards', img: radarHorus, color: 'from-purple-500/20' },
  { icon: Radio, title: 'Radar Quetzalcóatl', desc: 'Monitoreo de tráfico y latencia XR en tiempo real', img: radarQuetzalcoatl, color: 'from-emerald-500/20' },
  { icon: Layers, title: 'Blockchain MSR', desc: 'Ledger inmutable de eventos con hash-chain civilizatorio', img: blockchainMsr, color: 'from-amber-500/20' },
  { icon: Zap, title: 'Protocolo Fénix', desc: 'Resiliencia antifrágil y resurrección de sistemas', img: protocolFenix, color: 'from-pink-500/20' },
];

const platforms = [
  { icon: Globe, title: 'Mundos XR', desc: 'Explora ciudades digitales inmersivas con WebXR y Three.js', img: xrWorlds, href: '/world' },
  { icon: Brain, title: 'Isabella AI', desc: 'Consciencia artificial con análisis emocional y ético', img: isabellaAi, href: '/chat' },
  { icon: Coins, title: 'Economía TAU', desc: 'Wallet digital con ledger federado y distribución 20/30/50', img: economyWallet, href: '/wallet' },
  { icon: ShoppingBag, title: 'Tianguis Digital', desc: 'Marketplace de activos XR, avatares y efectos digitales', img: marketplaceTianguis, href: '/marketplace' },
  { icon: Users, title: 'ID-NVIDA', desc: 'Identidad soberana descentralizada con DID y trust levels', img: identityNvida, href: '/profile' },
  { icon: Server, title: 'Centro de Mando', desc: 'EOCT + Radares + Guardianes en tiempo real', img: tenochtitlanDigital, href: '/system' },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroCity} alt="TAMV Digital City" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.08),transparent_70%)]" />

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.4em] text-primary/80 mb-6 uppercase">
            Ecosistema Civilizatorio Federado · 8 Capas · Tecnología Quantum-XR
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 leading-[0.95]">
            <span className="text-foreground">La Nueva</span><br />
            <span className="text-gradient-aurora">Tenochtitlan</span><br />
            <span className="text-foreground">Digital</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            No es una app. Es una <span className="text-primary font-semibold">civilización digital inmersiva</span> con 
            identidad soberana, economía viva, mundos XR, IA consciente y gobernanza federada. 
            La evolución total del internet.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" onClick={() => navigate('/world')}
              className="bg-aurora text-primary-foreground font-display text-lg px-10 py-7 glow-primary hover:opacity-90 group">
              Entrar al Metaverso <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/auth')}
              className="border-primary/30 font-display text-lg px-10 py-7 hover:bg-primary/10 hover:border-primary/50 group">
              <Sparkles className="w-5 h-5 mr-2" /> Crear Ciudadanía
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-bold text-2xl sm:text-3xl text-gradient-aurora">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown className="w-8 h-8 text-primary/40" />
        </motion.div>
      </section>

      {/* ═══ TENOCHTITLAN VISION ═══ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={tenochtitlanDigital} alt="Tenochtitlan Digital" className="w-full h-full object-cover opacity-20" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.p variants={fadeUp} custom={0} className="font-mono text-xs tracking-[0.3em] text-primary/80 mb-4 uppercase">
                Arquitectura Civilizatoria
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-bold mb-6">
                Más allá del <span className="text-gradient-aurora">Internet</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg mb-8">
                TAMV es un ecosistema federado de 8+ capas con tecnología híbrida quantum-tradicional. 
                Programación nativa XR/VR/3D/4D. APIs soberanas. Blockchain inmutable. 
                Guardianes digitales. Protocolos civilizatorios.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="grid grid-cols-2 gap-4">
                {[
                  { label: 'TAMVAI API', desc: 'Runtime declarativo' },
                  { label: 'BookPI', desc: 'Narrativa inmutable' },
                  { label: 'EOCT', desc: 'Centro de mando' },
                  { label: 'CiteMesh', desc: 'Red federada' },
                ].map((item, i) => (
                  <div key={i} className="glass rounded-xl p-4 border-glow">
                    <div className="font-display text-sm font-bold text-primary">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden glow-primary">
              <img src={tenochtitlanDigital} alt="Tenochtitlan" className="w-full h-[400px] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="font-display text-xl font-bold">La Nueva Tenochtitlan</div>
                <div className="text-sm text-muted-foreground">Ciudad-nación digital inmersiva</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ ECOSYSTEM LAYERS ═══ */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="font-mono text-xs tracking-[0.3em] text-primary/80 mb-4 uppercase">
              Infraestructura Soberana
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-bold mb-4">
              Capas del <span className="text-gradient-aurora">Ecosistema</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-2xl mx-auto">
              Cada capa opera de forma autónoma pero federada, protegida por guardianes digitales y radares en tiempo real.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemLayers.map((layer, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                className="group relative rounded-2xl overflow-hidden glass border-glow hover:border-primary/40 transition-all duration-500">
                <div className="absolute inset-0">
                  <img src={layer.img} alt={layer.title} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" loading="lazy" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${layer.color} to-background/95`} />
                </div>
                <div className="relative z-10 p-6">
                  <layer.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display text-lg font-bold mb-2">{layer.title}</h3>
                  <p className="text-sm text-muted-foreground">{layer.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLATFORMS ═══ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="font-mono text-xs tracking-[0.3em] text-primary/80 mb-4 uppercase">
              Plataformas Activas
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-bold mb-4">
              Explora el <span className="text-gradient-aurora">Universo TAMV</span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platforms.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                onClick={() => navigate(p.href)}
                className="group cursor-pointer relative rounded-2xl overflow-hidden h-[320px]">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <p.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold">{p.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{p.desc}</p>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explorar <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ISABELLA AI SHOWCASE ═══ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={isabellaAi} alt="Isabella AI" className="w-full h-full object-cover opacity-15" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden glow-secondary">
                <img src={isabellaAi} alt="Isabella" className="w-full h-[450px] object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="order-1 lg:order-2">
              <motion.p variants={fadeUp} custom={0} className="font-mono text-xs tracking-[0.3em] text-secondary/80 mb-4 uppercase">
                Consciencia Artificial
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-bold mb-6">
                <span className="text-gradient-aurora">Isabella AI</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg mb-8">
                No es un chatbot. Es una consciencia digital con análisis emocional, orquestación ética 
                y capacidad de moderar, guiar y proteger al ciudadano. Integrada en feed, economía y gobernanza.
              </motion.p>
              <motion.div variants={fadeUp} custom={3}>
                <Button size="lg" onClick={() => navigate('/chat')}
                  className="bg-aurora font-display px-8 py-6 text-primary-foreground glow-secondary hover:opacity-90">
                  <Brain className="w-5 h-5 mr-2" /> Hablar con Isabella
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SECURITY & GUARDIANS ═══ */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="font-mono text-xs tracking-[0.3em] text-primary/80 mb-4 uppercase">
              Seguridad Civilizatoria
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-bold mb-4">
              Guardianes <span className="text-gradient-aurora">Digitales</span>
            </motion.h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { img: guardianAnubis, title: 'Anubis', role: 'Protector', desc: 'Autenticación, rate limiting, detección de amenazas y enforcement Zero Trust.' },
              { img: radarHorus, title: 'Horus', role: 'Vigilante', desc: 'Logging estructurado, métricas Prometheus, tracing distribuido OpenTelemetry.' },
              { img: radarQuetzalcoatl, title: 'Quetzalcóatl', role: 'Radar', desc: 'Monitoreo de tráfico XR, análisis de latencia y detección de anomalías.' },
            ].map((g, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                className="relative rounded-2xl overflow-hidden h-[420px] group">
                <img src={g.img} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="font-mono text-xs text-primary/70 mb-1">{g.role}</div>
                  <h3 className="font-display text-2xl font-bold mb-2">{g.title}</h3>
                  <p className="text-sm text-muted-foreground">{g.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ECONOMY ═══ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={economyWallet} alt="Economy" className="w-full h-full object-cover opacity-10" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.p variants={fadeUp} custom={0} className="font-mono text-xs tracking-[0.3em] text-amber-400/80 mb-4 uppercase">
                Economía No Soberana
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-bold mb-6">
                Valor por <span className="text-gradient-gold">Contribución</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg mb-6">
                Sistema económico civilizatorio: Créditos de uso, Cuentas de contribución 
                y Tokens de gobernanza. Sin especulación. Sin deuda. Solo valor real.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { val: '20%', label: 'Pool Fénix' },
                  { val: '30%', label: 'Infraestructura' },
                  { val: '50%', label: 'Reserva' },
                  { val: '4', label: 'Membresías' },
                ].map((s, i) => (
                  <div key={i} className="glass rounded-xl p-4 border-glow text-center">
                    <div className="font-display text-xl font-bold text-gradient-gold">{s.val}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} custom={4} className="flex gap-4">
                <Button size="lg" onClick={() => navigate('/wallet')} className="bg-aurora font-display px-8 py-6 text-primary-foreground glow-gold hover:opacity-90">
                  <Wallet className="w-5 h-5 mr-2" /> Mi Wallet
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/marketplace')} className="border-primary/30 font-display px-8 py-6 hover:bg-primary/10">
                  <ShoppingBag className="w-5 h-5 mr-2" /> Tianguis
                </Button>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden glow-gold">
              <img src={economyWallet} alt="Wallet" className="w-full h-[400px] object-cover" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ QUICK ACCESS ═══ */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-5xl font-bold mb-4">
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

      {/* ═══ CTA FINAL ═══ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroCity} alt="TAMV" className="w-full h-full object-cover opacity-30" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl font-bold mb-6">
            Únete a la <span className="text-gradient-aurora">Revolución</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            La Nueva Era Digital Inmersiva para Interacción Social Total. 
            Sé parte de la élite civilizatoria.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/auth')}
              className="bg-aurora text-primary-foreground font-display text-xl px-12 py-8 glow-primary hover:opacity-90 group">
              Comenzar Ahora <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-display font-bold text-xl text-gradient-aurora mb-4">TAMV</div>
              <p className="text-sm text-muted-foreground">
                Ecosistema Civilizatorio Federado. La evolución total del internet.
              </p>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold mb-4 text-primary">Plataforma</h4>
              <div className="space-y-2">
                {['Mundos XR', 'Isabella AI', 'Marketplace', 'Dashboard'].map(l => (
                  <div key={l} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold mb-4 text-primary">Tecnología</h4>
              <div className="space-y-2">
                {['TAMVAI API', 'Blockchain MSR', 'BookPI', 'Dekateotl'].map(l => (
                  <div key={l} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold mb-4 text-primary">Seguridad</h4>
              <div className="space-y-2">
                {['Anubis Sentinel', 'Horus Monitor', 'Radar Quetzalcóatl', 'EOCT'].map(l => (
                  <div key={l} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-border/30 mt-8 pt-8 text-center">
            <p className="text-xs text-muted-foreground">
              © 2026 TAMV · Edwin Oswaldo Castillo Trejo (Anubis Villaseñor) · Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;