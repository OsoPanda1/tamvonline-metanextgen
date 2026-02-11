import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Code2, Play, Shield, Eye, Zap, Lock, Search,
  Loader2, CheckCircle2, XCircle, AlertTriangle, Copy
} from 'lucide-react';
import {
  TAMVAI_SPEC, findOperation, getOperationsByDomain,
  type TamvaiOperation, type TamvaiDomain
} from '@/tamvai/spec';
import { executeOperation, type RuntimeContext, type RuntimeResult } from '@/tamvai/runtime';
import { toast } from 'sonner';

export default function ApiConsole() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedOp, setSelectedOp] = useState<TamvaiOperation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<TamvaiDomain | 'all'>('all');
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<RuntimeResult | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const filteredOps = TAMVAI_SPEC.operations.filter(op => {
    const matchesDomain = selectedDomain === 'all' || op.domain === selectedDomain;
    const matchesSearch = !searchQuery ||
      op.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleExecute = async (op: TamvaiOperation) => {
    setExecuting(true);
    setResult(null);

    const ctx: RuntimeContext = {
      userId: user?.id,
      sessionToken: user ? 'active' : undefined,
      timestamp: new Date().toISOString(),
      traceId: crypto.randomUUID().slice(0, 8),
    };

    try {
      const res = await executeOperation(op, ctx);
      setResult(res);
      if (res.success) {
        toast.success(`${op.id} ejecutado correctamente`);
      } else {
        toast.error(`${op.id}: ${res.error}`);
      }
    } catch (e) {
      toast.error(`Error ejecutando ${op.id}`);
    } finally {
      setExecuting(false);
    }
  };

  const methodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'POST': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'PATCH': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'DELETE': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-aurora flex items-center justify-center glow-primary">
                <Code2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">TAMVAI · API Console</h1>
                <p className="text-sm text-muted-foreground">
                  Explora y ejecuta {TAMVAI_SPEC.operations.length} operaciones del ecosistema
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">

            {/* Left: Operation List */}
            <div className="lg:col-span-2">
              {/* Search + Filter */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar operación..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card/50"
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <Button
                    size="sm"
                    variant={selectedDomain === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedDomain('all')}
                    className="text-xs h-7"
                  >
                    Todos
                  </Button>
                  {TAMVAI_SPEC.domains.map(d => (
                    <Button
                      key={d}
                      size="sm"
                      variant={selectedDomain === d ? 'default' : 'outline'}
                      onClick={() => setSelectedDomain(d)}
                      className="text-xs h-7"
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Operations List */}
              <ScrollArea className="h-[calc(100vh-320px)]">
                <div className="space-y-1.5 pr-3">
                  {filteredOps.map(op => (
                    <motion.button
                      key={op.id}
                      onClick={() => { setSelectedOp(op); setResult(null); }}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedOp?.id === op.id
                          ? 'border-primary/50 bg-primary/10'
                          : 'border-border/50 bg-card/30 hover:bg-card/60 hover:border-primary/20'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 rounded border font-mono font-bold text-[10px] ${methodColor(op.method)}`}>
                          {op.method}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground truncate">{op.path}</span>
                      </div>
                      <p className="text-xs text-foreground font-medium truncate">{op.id}</p>
                      <div className="flex gap-1 mt-1">
                        {op.securityTags.map(tag => (
                          <span key={tag} className="text-[9px] px-1 rounded bg-destructive/10 text-destructive">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Right: Operation Detail */}
            <div className="lg:col-span-3">
              {selectedOp ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={selectedOp.id}>
                  {/* Op Header */}
                  <Card className="glass border-primary/20 mb-4">
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded border font-mono font-bold text-xs ${methodColor(selectedOp.method)}`}>
                              {selectedOp.method}
                            </span>
                            <code className="text-sm font-mono text-foreground">{selectedOp.path}</code>
                          </div>
                          <h2 className="font-display text-lg font-bold">{selectedOp.id}</h2>
                          <p className="text-sm text-muted-foreground mt-1">{selectedOp.description}</p>
                        </div>
                        <Button
                          onClick={() => handleExecute(selectedOp)}
                          disabled={executing}
                          className="bg-aurora shrink-0"
                        >
                          {executing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                          Ejecutar
                        </Button>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Auth:</span>
                          <span className="text-xs font-mono text-foreground">
                            {selectedOp.auth.required ? selectedOp.auth.scope : 'public'}
                          </span>
                        </div>
                        <span className="text-muted-foreground">·</span>
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Security:</span>
                          {selectedOp.securityTags.map(t => (
                            <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-mono">{t}</span>
                          ))}
                        </div>
                        <span className="text-muted-foreground">·</span>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Monitor:</span>
                          {selectedOp.monitoringTags.map(t => (
                            <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">{t}</span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Input/Output Schema */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {selectedOp.input && (
                      <Card className="glass border-primary/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Input</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs font-mono text-foreground bg-card/50 p-3 rounded-lg overflow-auto">
                            {JSON.stringify(selectedOp.input, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    )}
                    {selectedOp.output && (
                      <Card className="glass border-primary/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Output</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs font-mono text-foreground bg-card/50 p-3 rounded-lg overflow-auto">
                            {JSON.stringify(selectedOp.output, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Audit Info */}
                  <Card className="glass border-primary/20 mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Audit & Emergency
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Log Payload: </span>
                          <span className={selectedOp.audit.logPayload ? 'text-green-400' : 'text-muted-foreground'}>
                            {selectedOp.audit.logPayload ? 'Sí' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Redacted: </span>
                          <span className="font-mono">{selectedOp.audit.redactedFields.join(', ') || 'ninguno'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Emergency: </span>
                          <span className={`font-mono font-bold ${
                            selectedOp.audit.emergencyPlan === 'FULL_LOCKDOWN' ? 'text-red-400'
                            : selectedOp.audit.emergencyPlan === 'READ_ONLY' ? 'text-yellow-400'
                            : 'text-green-400'
                          }`}>
                            {selectedOp.audit.emergencyPlan}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Execution Result */}
                  {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className={`border ${result.success ? 'border-green-400/30' : 'border-red-400/30'}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            {result.success
                              ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                              : <XCircle className="w-4 h-4 text-red-400" />
                            }
                            <span className={result.success ? 'text-green-400' : 'text-red-400'}>
                              {result.statusCode} · {result.success ? 'Éxito' : 'Error'}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto font-mono">
                              trace: {result.traceId}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {/* Security Checks */}
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1">Security Checks:</p>
                            <div className="flex gap-2">
                              {result.securityChecks.map((c, i) => (
                                <span key={i} className={`text-xs px-2 py-0.5 rounded font-mono ${
                                  c.passed ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                                }`}>
                                  {c.tag}: {c.passed ? 'PASS' : c.detail}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Monitoring Events */}
                          {result.monitoringEvents.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-1">Monitoring:</p>
                              <div className="flex gap-1 flex-wrap">
                                {result.monitoringEvents.map((e, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">{e}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Response */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-muted-foreground">Response:</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs"
                                onClick={() => {
                                  navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
                                  toast.success('Copiado');
                                }}
                              >
                                <Copy className="w-3 h-3 mr-1" /> Copiar
                              </Button>
                            </div>
                            <pre className="text-xs font-mono bg-card/80 p-3 rounded-lg overflow-auto max-h-48 text-foreground">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <Code2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="font-display text-lg font-medium mb-2">Selecciona una operación</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Explora las {TAMVAI_SPEC.operations.length} operaciones del ecosistema TAMV.
                    Cada una incluye seguridad, monitoreo y auditoría declarativa.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
