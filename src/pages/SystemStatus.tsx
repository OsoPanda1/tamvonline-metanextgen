import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Shield, Activity, Radio, Eye, AlertTriangle, CheckCircle2,
  Loader2, Zap, Globe, Lock, Cpu, Server, Database,
  TrendingUp, BarChart3, Waves
} from 'lucide-react';
import { getEOCTState, type EOCTLevel } from '@/lib/tamv/eoct';
import { getGuardianStatuses, type Guardian } from '@/lib/tamv/guardianias';
import { getHealth } from '@/lib/tamv/horus';
import { TAMVAI_SPEC, getOperationsByDomain, getSecurityCriticalOps } from '@/tamvai/spec';
import { getEmergencyMode } from '@/tamvai/runtime';

const EOCT_COLORS: Record<EOCTLevel, string> = {
  GREEN: 'text-green-400 bg-green-400/20',
  YELLOW: 'text-yellow-400 bg-yellow-400/20',
  ORANGE: 'text-orange-400 bg-orange-400/20',
  RED: 'text-red-500 bg-red-500/20',
  BLACK: 'text-white bg-white/20',
};

const GUARDIAN_ICONS: Record<string, typeof Shield> = {
  'guardian-auth': Lock,
  'guardian-economy': TrendingUp,
  'guardian-xr': Globe,
  'guardian-ethics': Eye,
};

export default function SystemStatus() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [eoct, setEoct] = useState(getEOCTState());
  const [guardians, setGuardians] = useState<Guardian[]>(getGuardianStatuses());
  const [health, setHealth] = useState(getHealth());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  // Live refresh every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setEoct(getEOCTState());
      setGuardians(getGuardianStatuses());
      setHealth(getHealth());
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const emergencyMode = getEmergencyMode();
  const criticalOps = getSecurityCriticalOps();
  const domainStats = TAMVAI_SPEC.domains.map(d => ({
    domain: d,
    count: getOperationsByDomain(d).length,
  }));

  const radarData = [
    { name: 'Quetzalcóatl', type: 'XR/Tráfico', icon: Waves, status: 'nominal', color: 'text-cyan-400' },
    { name: 'Ojo de Ra', type: 'Amenazas', icon: Eye, status: 'nominal', color: 'text-amber-400' },
    { name: 'Gemelos MOS', type: 'Economía', icon: BarChart3, status: 'nominal', color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-aurora flex items-center justify-center glow-primary">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">TAMVAI · Centro de Mando</h1>
                <p className="text-sm text-muted-foreground">
                  {TAMVAI_SPEC.operations.length} operaciones · v{TAMVAI_SPEC.version} · {health.status}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold ${EOCT_COLORS[eoct.level]}`}>
                  <Zap className="w-3 h-3" />
                  EOCT: {eoct.level}
                </span>
                {emergencyMode !== 'NONE' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-red-400 bg-red-400/20 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    {emergencyMode}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Top Grid: EOCT + Health + Emergency */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* EOCT State */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass border-primary/20 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" /> EOCT — Centro de Mando
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-display font-bold mb-3 ${EOCT_COLORS[eoct.level]}`}>
                    <Shield className="w-5 h-5" />
                    Nivel {eoct.level}
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-muted-foreground">
                      Protocolos activos: <span className="text-foreground font-medium">{eoct.active_protocols.length || 'Ninguno'}</span>
                    </p>
                    {eoct.active_protocols.map(p => (
                      <span key={p} className="inline-block px-2 py-0.5 rounded bg-primary/20 text-primary text-xs mr-1">{p}</span>
                    ))}
                    <p className="text-muted-foreground">
                      Señales pendientes: <span className="text-foreground font-medium">{eoct.pending_signals.filter(s => !s.processed).length}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* System Health */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="glass border-primary/20 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-sm flex items-center gap-2">
                    <Server className="w-4 h-4 text-primary" /> Salud del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-display font-bold mb-3 ${
                    health.status === 'healthy' ? 'text-green-400 bg-green-400/20'
                    : health.status === 'degraded' ? 'text-yellow-400 bg-yellow-400/20'
                    : 'text-red-400 bg-red-400/20'
                  }`}>
                    {health.status === 'healthy' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    {health.status.toUpperCase()}
                  </div>
                  <div className="space-y-2">
                    {Object.entries(health.checks).map(([name, check]) => (
                      <div key={name} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{name.replace('_', ' ')}</span>
                        <span className={check.ok ? 'text-green-400' : 'text-red-400'}>
                          {check.ok ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-2">Uptime: {health.uptime_s}s</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* API Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass border-primary/20 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-sm flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" /> TAMVAI API v{TAMVAI_SPEC.version}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-center">
                      <p className="text-2xl font-display font-bold text-primary">{TAMVAI_SPEC.operations.length}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Operaciones</p>
                    </div>
                    <div className="p-3 rounded-lg bg-destructive/10 text-center">
                      <p className="text-2xl font-display font-bold text-destructive">{criticalOps.length}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">AZTEK_GODS</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {domainStats.slice(0, 5).map(d => (
                      <div key={d.domain} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{d.domain}</span>
                        <span className="font-mono text-primary">{d.count} ops</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Guardians */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6">
            <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Guardianías Activas
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {guardians.map((g, i) => {
                const Icon = GUARDIAN_ICONS[g.id] || Shield;
                const statusColor = g.status === 'watching' ? 'text-green-400'
                  : g.status === 'alert' ? 'text-yellow-400'
                  : g.status === 'intervening' ? 'text-red-400'
                  : 'text-muted-foreground';
                return (
                  <motion.div key={g.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                    <Card className="glass border-primary/20 hover:border-primary/40 transition-colors">
                      <CardContent className="pt-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg bg-card flex items-center justify-center ${statusColor}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{g.name}</p>
                            <p className="text-xs text-muted-foreground">{g.domain}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-mono uppercase ${statusColor}`}>
                            {g.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {g.alerts_triggered} alertas
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Radars */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-6">
            <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
              <Radio className="w-5 h-5 text-primary" /> Radares de Vigilancia
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {radarData.map((radar, i) => (
                <motion.div key={radar.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }}>
                  <Card className="glass border-primary/20">
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-card flex items-center justify-center ${radar.color}`}>
                          <radar.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{radar.name}</p>
                          <p className="text-xs text-muted-foreground">{radar.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-400 font-mono uppercase">NOMINAL</span>
                      </div>
                      {/* Fake signal bars */}
                      <div className="flex items-end gap-0.5 mt-3 h-8">
                        {Array.from({ length: 20 }).map((_, j) => (
                          <div
                            key={j}
                            className={`flex-1 rounded-t-sm ${radar.color.replace('text-', 'bg-')}/40`}
                            style={{ height: `${Math.random() * 100}%`, opacity: 0.3 + Math.random() * 0.7 }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* API Operations by Domain */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" /> Operaciones TAMVAI por Dominio
            </h2>
            <div className="grid lg:grid-cols-3 gap-4">
              {TAMVAI_SPEC.domains.map((domain) => {
                const ops = getOperationsByDomain(domain);
                if (ops.length === 0) return null;
                return (
                  <Card key={domain} className="glass border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-display text-sm flex items-center justify-between">
                        <span>{domain}</span>
                        <span className="text-xs font-mono text-primary">{ops.length} ops</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1.5">
                        {ops.map(op => {
                          const methodColor = op.method === 'GET' ? 'text-green-400 bg-green-400/10'
                            : op.method === 'POST' ? 'text-blue-400 bg-blue-400/10'
                            : op.method === 'PATCH' ? 'text-yellow-400 bg-yellow-400/10'
                            : 'text-red-400 bg-red-400/10';
                          return (
                            <div key={op.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-primary/5 transition-colors">
                              <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${methodColor}`}>
                                {op.method}
                              </span>
                              <span className="text-muted-foreground font-mono truncate flex-1">{op.path}</span>
                              {op.securityTags.includes('AZTEK_GODS') && (
                                <Shield className="w-3 h-3 text-destructive shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
