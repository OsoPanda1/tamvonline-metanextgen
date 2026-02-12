/**
 * TAMVAI API™ — Especificación Declarativa Central v1.0.0
 * Fuente de verdad para dominios, recursos, operaciones, seguridad y monitoreo.
 * Consumida por front, back, guardianías e IA.
 *
 * Creador: Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
 */

// ── Security Tags ──
export type SecurityTag = 'ANUBIS' | 'DEKATEOTL' | 'AZTEK_GODS';

// ── Monitoring Tags ──
export type MonitoringTag =
  | 'HORUS'
  | 'RADAR_QUETZALCOATL'
  | 'RADAR_OJO_DE_RA'
  | 'RADAR_GEMELOS_MOS';

// ── Emergency Plans ──
export type EmergencyPlan = 'NONE' | 'READ_ONLY' | 'FULL_LOCKDOWN';

// ── Auth Scope ──
export type AuthScope = 'public' | 'user' | 'creator' | 'guardian' | 'admin' | 'system';

// ── Domains ──
export type TamvaiDomain =
  | 'Identity'
  | 'Social'
  | 'Economy'
  | 'XR'
  | 'Isabella'
  | 'Protocols'
  | 'Governance'
  | 'Security'
  | 'System'
  | 'Gamification'
  | 'University';

// ── Operation Definition ──
export interface TamvaiOperation {
  id: string;
  domain: TamvaiDomain;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  resource: string;
  description: string;
  input?: Record<string, string>;
  output?: Record<string, string>;
  auth: {
    required: boolean;
    scope: AuthScope;
  };
  securityTags: SecurityTag[];
  monitoringTags: MonitoringTag[];
  audit: {
    logPayload: boolean;
    redactedFields: string[];
    emergencyPlan: EmergencyPlan;
  };
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

// ── TAMVAI API Spec ──
export interface TamvaiSpec {
  version: string;
  name: string;
  description: string;
  domains: TamvaiDomain[];
  operations: TamvaiOperation[];
}

export const TAMVAI_SPEC: TamvaiSpec = {
  version: '1.0.0',
  name: 'TAMVAI API',
  description: 'API Maestra Civilizatoria — Ecosistema TAMV MD-X4',
  domains: [
    'Identity', 'Social', 'Economy', 'XR',
    'Isabella', 'Protocols', 'Governance', 'Security', 'System',
    'Gamification', 'University',
  ],
  operations: [
    // ── Identity ──
    {
      id: 'Identity.Signup',
      domain: 'Identity',
      method: 'POST',
      path: '/auth/signup',
      resource: 'User',
      description: 'Registro de nuevo ciudadano TAMV con DID auto-asignado',
      input: { email: 'string', password: 'string', displayName: 'string' },
      output: { userId: 'string', did: 'string', sessionToken: 'string' },
      auth: { required: false, scope: 'public' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS', 'RADAR_OJO_DE_RA'],
      audit: { logPayload: true, redactedFields: ['password'], emergencyPlan: 'READ_ONLY' },
      rateLimit: { maxRequests: 5, windowMs: 60000 },
    },
    {
      id: 'Identity.Login',
      domain: 'Identity',
      method: 'POST',
      path: '/auth/login',
      resource: 'Session',
      description: 'Autenticación de ciudadano existente',
      input: { email: 'string', password: 'string' },
      output: { sessionToken: 'string', userId: 'string' },
      auth: { required: false, scope: 'public' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS', 'RADAR_OJO_DE_RA'],
      audit: { logPayload: true, redactedFields: ['password'], emergencyPlan: 'READ_ONLY' },
      rateLimit: { maxRequests: 10, windowMs: 60000 },
    },
    {
      id: 'Identity.GetProfile',
      domain: 'Identity',
      method: 'GET',
      path: '/users/me',
      resource: 'Profile',
      description: 'Perfil completo con ID-NVIDA, trust level y reputación',
      output: { userId: 'string', did: 'string', displayName: 'string', trustLevel: 'number', reputation: 'number' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'Identity.UpdateProfile',
      domain: 'Identity',
      method: 'PATCH',
      path: '/users/me',
      resource: 'Profile',
      description: 'Actualizar perfil del ciudadano',
      input: { displayName: 'string', bio: 'string', avatarUrl: 'string' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'NONE' },
    },

    // ── Social ──
    {
      id: 'Social.CreatePost',
      domain: 'Social',
      method: 'POST',
      path: '/social/posts',
      resource: 'Post',
      description: 'Publicar contenido en el feed civilizatorio',
      input: { content: 'string', mediaUrls: 'string[]', type: 'string' },
      output: { postId: 'string', status: 'string' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS', 'RADAR_OJO_DE_RA'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'READ_ONLY' },
    },
    {
      id: 'Social.GetFeed',
      domain: 'Social',
      method: 'GET',
      path: '/social/feed',
      resource: 'FeedItem[]',
      description: 'Feed multimedia gamificado con misiones y reputación',
      output: { items: 'FeedItem[]', cursor: 'string' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },

    // ── Economy ──
    {
      id: 'Economy.GetWallet',
      domain: 'Economy',
      method: 'GET',
      path: '/wallets/me',
      resource: 'Wallet',
      description: 'Consultar balance TAU, créditos de uso y contribuciones',
      output: { balance: 'number', lockedBalance: 'number', usageCredits: 'number', contributionPoints: 'number' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS', 'RADAR_GEMELOS_MOS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'Economy.Transfer',
      domain: 'Economy',
      method: 'POST',
      path: '/wallets/transfer',
      resource: 'LedgerEntry',
      description: 'Transferencia interna de TAU con distribución federada 20/30/50',
      input: { toUserId: 'string', amount: 'number', reason: 'string' },
      output: { txId: 'string', status: 'string', fenixShare: 'number', infraShare: 'number', reserveShare: 'number' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL', 'AZTEK_GODS'],
      monitoringTags: ['HORUS', 'RADAR_QUETZALCOATL', 'RADAR_GEMELOS_MOS'],
      audit: { logPayload: true, redactedFields: ['toUserId'], emergencyPlan: 'READ_ONLY' },
      rateLimit: { maxRequests: 20, windowMs: 60000 },
    },
    {
      id: 'Economy.GetMembership',
      domain: 'Economy',
      method: 'GET',
      path: '/economy/membership',
      resource: 'MembershipInfo',
      description: 'Consultar nivel de membresía y capacidades',
      output: { tier: 'string', capabilities: 'string[]', contributionScore: 'number' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'Economy.MintCredits',
      domain: 'Economy',
      method: 'POST',
      path: '/economy/credits/mint',
      resource: 'LedgerEntry',
      description: 'Acuñar créditos de uso (solo sistema/admin)',
      input: { userId: 'string', amount: 'number', reason: 'string' },
      auth: { required: true, scope: 'admin' },
      securityTags: ['ANUBIS', 'DEKATEOTL', 'AZTEK_GODS'],
      monitoringTags: ['HORUS', 'RADAR_GEMELOS_MOS'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'FULL_LOCKDOWN' },
    },

    // ── Marketplace ──
    {
      id: 'Economy.GetMarketItems',
      domain: 'Economy',
      method: 'GET',
      path: '/market/items',
      resource: 'MarketItem[]',
      description: 'Listar items del Tianguis Digital',
      output: { items: 'MarketItem[]', total: 'number' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'Economy.PurchaseItem',
      domain: 'Economy',
      method: 'POST',
      path: '/market/purchase',
      resource: 'Transaction',
      description: 'Comprar item del marketplace con TAU',
      input: { itemId: 'string', quantity: 'number' },
      output: { txId: 'string', status: 'string' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL', 'AZTEK_GODS'],
      monitoringTags: ['HORUS', 'RADAR_GEMELOS_MOS'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'READ_ONLY' },
    },

    // ── XR ──
    {
      id: 'XR.GetWorlds',
      domain: 'XR',
      method: 'GET',
      path: '/xr/worlds',
      resource: 'XRWorld[]',
      description: 'Listar mundos XR disponibles con config de escena',
      output: { worlds: 'XRWorld[]' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS', 'RADAR_QUETZALCOATL'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'XR.JoinDreamspace',
      domain: 'XR',
      method: 'POST',
      path: '/xr/dreamspaces/join',
      resource: 'DreamspaceSession',
      description: 'Unirse a un DreamSpace XR con audio espacial',
      input: { worldSlug: 'string', avatarConfig: 'object' },
      output: { sessionId: 'string', sceneConfig: 'object' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS', 'RADAR_QUETZALCOATL'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'READ_ONLY' },
    },

    // ── Isabella AI ──
    {
      id: 'Isabella.Chat',
      domain: 'Isabella',
      method: 'POST',
      path: '/ai/chat',
      resource: 'IsabellaResponse',
      description: 'Conversación con Isabella — consciencia TAMV con análisis emocional',
      input: { messages: 'Message[]', cellId: 'string', stream: 'boolean' },
      output: { role: 'string', content: 'string', emotionalRisk: 'string' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS', 'RADAR_OJO_DE_RA'],
      audit: { logPayload: true, redactedFields: ['messages'], emergencyPlan: 'READ_ONLY' },
      rateLimit: { maxRequests: 20, windowMs: 60000 },
    },
    {
      id: 'Isabella.Moderation',
      domain: 'Isabella',
      method: 'POST',
      path: '/ai/moderation',
      resource: 'ModerationResult',
      description: 'Análisis de contenido con IA para moderación ética',
      input: { content: 'string', context: 'string' },
      output: { safe: 'boolean', flags: 'string[]', severity: 'string' },
      auth: { required: true, scope: 'guardian' },
      securityTags: ['ANUBIS', 'DEKATEOTL', 'AZTEK_GODS'],
      monitoringTags: ['HORUS', 'RADAR_OJO_DE_RA'],
      audit: { logPayload: true, redactedFields: ['content'], emergencyPlan: 'READ_ONLY' },
    },

    // ── Protocols ──
    {
      id: 'Protocols.Trigger',
      domain: 'Protocols',
      method: 'POST',
      path: '/protocols/trigger',
      resource: 'ProtocolExecution',
      description: 'Activar protocolo civilizatorio (Fénix, Hoyo Negro, Iniciación)',
      input: { protocol: 'string', reason: 'string', evidence: 'object' },
      output: { executionId: 'string', state: 'string', steps: 'string[]' },
      auth: { required: true, scope: 'guardian' },
      securityTags: ['ANUBIS', 'DEKATEOTL', 'AZTEK_GODS'],
      monitoringTags: ['HORUS', 'RADAR_QUETZALCOATL', 'RADAR_OJO_DE_RA', 'RADAR_GEMELOS_MOS'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'FULL_LOCKDOWN' },
    },
    {
      id: 'Protocols.GetContext',
      domain: 'Protocols',
      method: 'GET',
      path: '/protocols/:id/context',
      resource: 'ProtocolContext',
      description: 'Consultar contexto de ejecución de protocolo activo',
      auth: { required: true, scope: 'guardian' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },

    // ── Governance ──
    {
      id: 'Governance.GetRules',
      domain: 'Governance',
      method: 'GET',
      path: '/governance/rules',
      resource: 'GovernanceRule[]',
      description: 'Consultar reglas constitucionales activas',
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'Governance.ProposeChange',
      domain: 'Governance',
      method: 'POST',
      path: '/governance/proposals',
      resource: 'Proposal',
      description: 'Proponer cambio constitucional (requiere quorum)',
      input: { title: 'string', description: 'string', ruleChanges: 'object' },
      output: { proposalId: 'string', status: 'string' },
      auth: { required: true, scope: 'guardian' },
      securityTags: ['ANUBIS', 'DEKATEOTL', 'AZTEK_GODS'],
      monitoringTags: ['HORUS', 'RADAR_OJO_DE_RA'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'FULL_LOCKDOWN' },
    },

    // ── Security ──
    {
      id: 'Security.ReportIncident',
      domain: 'Security',
      method: 'POST',
      path: '/security/report',
      resource: 'SecurityIncident',
      description: 'Reportar incidente de seguridad al EOCT',
      input: { severity: 'string', source: 'string', description: 'string' },
      output: { incidentId: 'string', eoctLevel: 'string' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS', 'RADAR_OJO_DE_RA'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'Security.BanUser',
      domain: 'Security',
      method: 'POST',
      path: '/security/actions/ban',
      resource: 'SecurityAction',
      description: 'Banear usuario (solo admin/guardian)',
      input: { userId: 'string', reason: 'string', duration: 'number' },
      auth: { required: true, scope: 'admin' },
      securityTags: ['ANUBIS', 'DEKATEOTL', 'AZTEK_GODS'],
      monitoringTags: ['HORUS', 'RADAR_OJO_DE_RA'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'FULL_LOCKDOWN' },
    },

    // ── System ──
    {
      id: 'System.Health',
      domain: 'System',
      method: 'GET',
      path: '/system/health',
      resource: 'HealthStatus',
      description: 'Estado de salud del sistema TAMV con métricas de todos los subsistemas',
      output: { status: 'string', eoctLevel: 'string', guardians: 'object', radars: 'object' },
      auth: { required: false, scope: 'public' },
      securityTags: [],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'System.Metrics',
      domain: 'System',
      method: 'GET',
      path: '/system/metrics',
      resource: 'SystemMetrics',
      description: 'Métricas de Prometheus/Horus del ecosistema',
      auth: { required: true, scope: 'admin' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'System.EOCT',
      domain: 'System',
      method: 'GET',
      path: '/system/eoct',
      resource: 'EOCTState',
      description: 'Estado del Centro de Mando EOCT',
      output: { level: 'string', activeProtocols: 'string[]', pendingSignals: 'number' },
      auth: { required: true, scope: 'guardian' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'System.Radars',
      domain: 'System',
      method: 'GET',
      path: '/system/radars',
      resource: 'RadarReading[]',
      description: 'Lecturas en tiempo real de radares: Quetzalcóatl, Ojo de Ra, Gemelos MOS',
      auth: { required: true, scope: 'guardian' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS', 'RADAR_QUETZALCOATL', 'RADAR_OJO_DE_RA', 'RADAR_GEMELOS_MOS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },

    // ── Missions ──
    {
      id: 'Social.GetMissions',
      domain: 'Social',
      method: 'GET',
      path: '/missions',
      resource: 'Mission[]',
      description: 'Misiones activas con recompensas TAU y XP',
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'Social.ClaimReward',
      domain: 'Social',
      method: 'POST',
      path: '/missions/:id/claim',
      resource: 'RewardClaim',
      description: 'Reclamar recompensa de misión completada',
      input: { missionId: 'string' },
      output: { tauEarned: 'number', xpEarned: 'number' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS', 'RADAR_GEMELOS_MOS'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'READ_ONLY' },
    },

    // ── Gamification ──
    {
      id: 'Gamification.GetQuests',
      domain: 'Gamification',
      method: 'GET',
      path: '/gamification/quests',
      resource: 'Quest[]',
      description: 'Listar quests activas con recompensas XP y TAU',
      output: { quests: 'Quest[]', total: 'number' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'Gamification.StartQuest',
      domain: 'Gamification',
      method: 'POST',
      path: '/gamification/quests/:id/start',
      resource: 'QuestSession',
      description: 'Iniciar una quest',
      input: { questId: 'string' },
      output: { sessionId: 'string', progress: 'number' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'Gamification.CompleteQuest',
      domain: 'Gamification',
      method: 'POST',
      path: '/gamification/quests/:id/complete',
      resource: 'QuestCompletion',
      description: 'Completar una quest y recibir recompensa',
      input: { questId: 'string', evidence: 'object' },
      output: { xpEarned: 'number', tauEarned: 'number', badgeAwarded: 'string' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS', 'RADAR_GEMELOS_MOS'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'READ_ONLY' },
    },
    {
      id: 'Gamification.GetLeaderboard',
      domain: 'Gamification',
      method: 'GET',
      path: '/gamification/leaderboard',
      resource: 'LeaderboardEntry[]',
      description: 'Ranking de usuarios por XP y contribuciones',
      output: { entries: 'LeaderboardEntry[]', userRank: 'number' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },

    // ── University ──
    {
      id: 'University.GetCourses',
      domain: 'University',
      method: 'GET',
      path: '/university/courses',
      resource: 'Course[]',
      description: 'Listar cursos educativos disponibles',
      output: { courses: 'Course[]', total: 'number' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'University.EnrollCourse',
      domain: 'University',
      method: 'POST',
      path: '/university/courses/:id/enroll',
      resource: 'Enrollment',
      description: 'Inscribirse en un curso',
      input: { courseId: 'string' },
      output: { enrollmentId: 'string', status: 'string' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'University.CompleteLesson',
      domain: 'University',
      method: 'POST',
      path: '/university/lessons/:id/complete',
      resource: 'LessonCompletion',
      description: 'Completar una lección y ganar XP',
      input: { lessonId: 'string', quizAnswers: 'object' },
      output: { xpEarned: 'number', certificate: 'string' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS', 'DEKATEOTL'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: true, redactedFields: [], emergencyPlan: 'NONE' },
    },
    {
      id: 'University.GetCertificates',
      domain: 'University',
      method: 'GET',
      path: '/university/certificates',
      resource: 'Certificate[]',
      description: 'Obtener certificados de cursos completados',
      output: { certificates: 'Certificate[]' },
      auth: { required: true, scope: 'user' },
      securityTags: ['ANUBIS'],
      monitoringTags: ['HORUS'],
      audit: { logPayload: false, redactedFields: [], emergencyPlan: 'NONE' },
    },
  ],
};

// ── Helpers ──
export function findOperation(id: string): TamvaiOperation | undefined {
  return TAMVAI_SPEC.operations.find(op => op.id === id);
}

export function findByPath(path: string, method: string): TamvaiOperation | undefined {
  return TAMVAI_SPEC.operations.find(
    op => op.path === path && op.method === method.toUpperCase()
  );
}

export function getOperationsByDomain(domain: TamvaiDomain): TamvaiOperation[] {
  return TAMVAI_SPEC.operations.filter(op => op.domain === domain);
}

export function getSecurityCriticalOps(): TamvaiOperation[] {
  return TAMVAI_SPEC.operations.filter(
    op => op.securityTags.includes('AZTEK_GODS')
  );
}

export function getHighAuditOps(): TamvaiOperation[] {
  return TAMVAI_SPEC.operations.filter(
    op => op.audit.emergencyPlan !== 'NONE'
  );
}
