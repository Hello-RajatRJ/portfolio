import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Shield,
  Key,
  Server,
  Activity,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Lock,
  Database,
  ArrowRight,
} from 'lucide-react';

type UserRole = 'guest' | 'engineer' | 'compliance_admin';

interface RoleConfig {
  label: string;
  badge: string;
  rateLimit: number; // max requests per window
  allowedEndpoints: string[];
  permissions: string[];
  tokenPayload: Record<string, unknown>;
}

const ROLES: Record<UserRole, RoleConfig> = {
  guest: {
    label: 'Guest Viewer',
    badge: 'READ ONLY',
    rateLimit: 5,
    allowedEndpoints: ['GET /api/v1/tax/health', 'GET /api/v1/metrics/summary'],
    permissions: ['metrics:read', 'health:check'],
    tokenPayload: {
      sub: 'usr_guest_4091',
      role: 'guest',
      scope: ['read:public'],
      mfa_verified: false,
    },
  },
  engineer: {
    label: 'Product Engineer',
    badge: 'READ / WRITE',
    rateLimit: 15,
    allowedEndpoints: [
      'GET /api/v1/tax/health',
      'GET /api/v1/metrics/summary',
      'POST /api/v1/tax/calculate',
      'POST /api/v1/ai/vector-embed',
    ],
    permissions: ['tax:calculate', 'ai:embed', 'metrics:read', 'rules:validate'],
    tokenPayload: {
      sub: 'usr_eng_rajat_992',
      role: 'staff_engineer',
      dept: 'fintech_systems',
      scope: ['read:all', 'write:tax_rules', 'exec:workers'],
      mfa_verified: true,
    },
  },
  compliance_admin: {
    label: 'Compliance Admin (CereTax)',
    badge: 'FULL ELEVATED',
    rateLimit: 30,
    allowedEndpoints: [
      'GET /api/v1/tax/health',
      'GET /api/v1/metrics/summary',
      'POST /api/v1/tax/calculate',
      'POST /api/v1/ai/vector-embed',
      'GET /api/v1/clinical/audit-trail',
      'POST /api/v1/compliance/export-statutes',
    ],
    permissions: [
      'tax:calculate',
      'ai:embed',
      'audit:read_raw',
      'statute:export',
      'rbac:manage',
      'crypto:verify',
    ],
    tokenPayload: {
      sub: 'usr_admin_audit_001',
      role: 'compliance_admin',
      org: 'ceretax_enterprise',
      scope: ['read:all', 'write:all', 'audit:elevated', 'export:statutes'],
      mfa_verified: true,
      clearance_tier: 'SOX_SOC2_TIER_1',
    },
  },
};

interface ApiLogEntry {
  id: string;
  timestamp: string;
  endpoint: string;
  role: UserRole;
  status: number;
  latencyMs: number;
  allowed: boolean;
  message: string;
}

export const LiveBackendDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const [sessionTimestamp] = useState(() => Math.floor(Date.now() / 1000));
  const [activeRole, setActiveRole] = useState<UserRole>('engineer');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('POST /api/v1/tax/calculate');
  const [tokensRemaining, setTokensRemaining] = useState<number>(15);
  const [maxTokens, setMaxTokens] = useState<number>(15);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'jwt' | 'schema'>('console');
  const [logs, setLogs] = useState<ApiLogEntry[]>([
    {
      id: 'init-1',
      timestamp: '10:14:02',
      endpoint: 'POST /api/v1/tax/calculate',
      role: 'engineer',
      status: 200,
      latencyMs: 38,
      allowed: true,
      message: 'Computed 14 state jurisdictions across 12 line items. 0 schema violations.',
    },
  ]);
  const [lastResponse, setLastResponse] = useState<Record<string, unknown>>({
    status: 'success',
    code: 200,
    requestId: 'req_live_68a91bc74e',
    executionTimeMs: 38,
    data: {
      jurisdictionsEvaluated: 14,
      aggregateTaxDue: 142.85,
      complianceCheckPassed: true,
      statuteVersion: '2026.Q4-US-REVISED',
      rateLimitRemaining: 14,
    },
  });

  const handleRoleChange = (roleKey: UserRole) => {
    setActiveRole(roleKey);
    const roleLimit = ROLES[roleKey].rateLimit;
    setMaxTokens(roleLimit);
    setTokensRemaining(roleLimit);
  };

  // Token Bucket continuous refill simulation (1 token every 2.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setTokensRemaining((prev) => Math.min(prev + 1, maxTokens));
    }, 2500);
    return () => clearInterval(interval);
  }, [maxTokens]);

  const handleFireRequest = async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    const roleConfig = ROLES[activeRole];
    const isEndpointAllowed = roleConfig.allowedEndpoints.includes(selectedEndpoint);

    // Rate limiter check
    if (tokensRemaining <= 0) {
      setTimeout(() => {
        const errorLog: ApiLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          endpoint: selectedEndpoint,
          role: activeRole,
          status: 429,
          latencyMs: 14,
          allowed: false,
          message: 'Rate limit exceeded: 0 tokens in bucket. Refilling 1 token / 2.5s.',
        };
        setLogs((prev) => [errorLog, ...prev.slice(0, 7)]);
        setLastResponse({
          error: 'Too Many Requests',
          statusCode: 429,
          message: 'Token bucket capacity exhausted for active role. Wait for bucket refill.',
          headers: {
            'X-RateLimit-Limit': maxTokens,
            'X-RateLimit-Remaining': 0,
            'Retry-After': 3,
          },
        });
        setIsExecuting(false);
      }, 150);
      return;
    }

    // Role-based authorization gate
    if (!isEndpointAllowed) {
      setTimeout(() => {
        setTokensRemaining((t) => Math.max(0, t - 1));
        const forbiddenLog: ApiLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          endpoint: selectedEndpoint,
          role: activeRole,
          status: 403,
          latencyMs: 22,
          allowed: false,
          message: `RBAC Forbidden: Role "${roleConfig.label}" lacks required permissions.`,
        };
        setLogs((prev) => [forbiddenLog, ...prev.slice(0, 7)]);
        setLastResponse({
          error: 'Forbidden',
          statusCode: 403,
          message: `Insufficient role permissions for ${selectedEndpoint}. Switch to an elevated role to test this endpoint.`,
          requiredPermissions: ['audit:read_raw', 'compliance:export'],
          currentPermissions: roleConfig.permissions,
        });
        setIsExecuting(false);
      }, 220);
      return;
    }

    // Successful request execution
    const simulatedLatency = Math.floor(Math.random() * 32) + 24; // 24ms - 56ms
    setTokensRemaining((t) => Math.max(0, t - 1));

    setTimeout(() => {
      const remainingAfter = Math.max(0, tokensRemaining - 1);
      const successLog: ApiLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        endpoint: selectedEndpoint,
        role: activeRole,
        status: 200,
        latencyMs: simulatedLatency,
        allowed: true,
        message:
          selectedEndpoint.includes('calculate')
            ? `PostgreSQL GIN query executed in ${simulatedLatency}ms. Matrix verified.`
            : `Payload validated and dispatched. Response cached in Redis.`,
      };

      setLogs((prev) => [successLog, ...prev.slice(0, 7)]);
      setLastResponse({
        status: 'success',
        code: 200,
        requestId: `req_${Math.random().toString(36).substring(2, 10)}`,
        executionTimeMs: simulatedLatency,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-RateLimit-Limit': maxTokens,
          'X-RateLimit-Remaining': remainingAfter,
          'X-Response-Time-Ms': simulatedLatency,
          'X-Cache-Lookup': 'HIT_REDIS_L2',
        },
        payload: {
          endpoint: selectedEndpoint,
          callerRole: activeRole,
          authenticatedSubject: roleConfig.tokenPayload.sub,
          transactionStatus: 'COMMITTED',
          timestamp: new Date().toISOString(),
        },
      });
      setIsExecuting(false);
    }, simulatedLatency + 100);
  };

  const currentRoleConfig = ROLES[activeRole];

  return (
    <section
      id="backend-telemetry"
      ref={ref}
      className="relative overflow-hidden bg-[#050505] py-20 sm:py-28 text-white border-t border-white/[0.04]"
    >
      {/* Background cyber grid & glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 20%, rgba(255, 48, 56, 0.18), transparent 65%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/20 px-3.5 py-1.5 font-mono text-xs text-red-400 mb-3.5 shadow-sm">
            <Server className="h-3.5 w-3.5 text-red-500" />
            <span>05. BACKEND &amp; API ARCHITECTURE</span>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Live Backend &amp;{' '}
            <span className="bg-gradient-to-r from-[#FF3038] to-[#C91520] bg-clip-text text-transparent">
              Auth Telemetry
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-neutral-400 leading-relaxed font-inter">
            Interactive demonstration of role-based access control (RBAC), token-bucket rate limiting,
            and live cryptographic JWT claim evaluation engineered for high-volume enterprise APIs.
          </p>
        </motion.div>

        {/* Interactive Telemetry Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Controls & RBAC Role Switcher (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Role Switcher Box */}
            <div className="rounded-2xl border border-white/12 bg-black/60 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <span className="font-mono text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-red-500" />
                  1. SELECT SIMULATED ROLE
                </span>
                <span className="rounded bg-red-950/40 border border-red-700/40 px-2 py-0.5 font-mono text-[10px] text-red-300 font-bold">
                  {currentRoleConfig.badge}
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {(Object.keys(ROLES) as UserRole[]).map((roleKey) => {
                  const role = ROLES[roleKey];
                  const active = activeRole === roleKey;
                  return (
                    <button
                      key={roleKey}
                      type="button"
                      onClick={() => handleRoleChange(roleKey)}
                      className={`w-full text-left rounded-xl border p-3 transition-all flex items-center justify-between cursor-pointer ${
                        active
                          ? 'border-red-500 bg-red-950/30 text-white shadow-[0_0_15px_rgba(255,48,56,0.25)]'
                          : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/25 hover:text-neutral-200'
                      }`}
                    >
                      <div>
                        <p className="font-orbitron text-xs sm:text-sm font-bold text-white">
                          {role.label}
                        </p>
                        <p className="font-mono text-[11px] text-neutral-400 mt-0.5">
                          Bucket Capacity: {role.rateLimit} req / min
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-neutral-400">
                          {role.permissions.length} perms
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full border ${
                            active ? 'border-red-500 bg-red-500' : 'border-neutral-600'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Endpoint Selector & Execution Trigger */}
            <div className="rounded-2xl border border-white/12 bg-black/60 p-5 backdrop-blur-md">
              <span className="font-mono text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-white/10">
                <Terminal className="h-4 w-4 text-red-500" />
                2. SELECT API ENDPOINT
              </span>

              <div className="mt-3.5 space-y-2">
                {[
                  'POST /api/v1/tax/calculate',
                  'GET /api/v1/clinical/audit-trail',
                  'POST /api/v1/ai/vector-embed',
                  'POST /api/v1/compliance/export-statutes',
                  'GET /api/v1/metrics/summary',
                ].map((ep) => {
                  const isAllowed = currentRoleConfig.allowedEndpoints.includes(ep);
                  return (
                    <button
                      key={ep}
                      type="button"
                      onClick={() => setSelectedEndpoint(ep)}
                      className={`w-full text-left rounded-lg border px-3 py-2 font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${
                        selectedEndpoint === ep
                          ? 'border-red-500/80 bg-red-950/40 text-white'
                          : 'border-white/8 bg-white/[0.015] text-neutral-400 hover:border-white/20'
                      }`}
                    >
                      <span className="truncate">{ep}</span>
                      {isAllowed ? (
                        <span className="shrink-0 text-[10px] text-emerald-400 font-semibold font-sans flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> 200
                        </span>
                      ) : (
                        <span className="shrink-0 text-[10px] text-rose-400 font-semibold font-sans flex items-center gap-1">
                          <Lock className="h-3 w-3" /> 403
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Fire Request CTA Button */}
              <button
                type="button"
                disabled={isExecuting}
                onClick={handleFireRequest}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#FF3038] to-[#C91520] py-3 px-4 font-orbitron text-xs sm:text-sm font-black tracking-wider text-white shadow-lg shadow-red-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>EXECUTING QUERY PIPELINE...</span>
                  </>
                ) : (
                  <>
                    <span>FIRE LIVE REQUEST</span>
                    <ArrowRight className="h-4 w-4 text-white" />
                  </>
                )}
              </button>
            </div>

            {/* Live Token-Bucket Rate Limiter Display */}
            <div className="rounded-2xl border border-white/12 bg-black/60 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  TOKEN BUCKET RATE LIMITER:
                </span>
                <span
                  className={`font-bold ${
                    tokensRemaining === 0
                      ? 'text-rose-400'
                      : tokensRemaining < 4
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {tokensRemaining} / {maxTokens} TOKENS
                </span>
              </div>

              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full transition-all duration-300 ${
                    tokensRemaining === 0
                      ? 'bg-rose-500'
                      : tokensRemaining < 4
                      ? 'bg-amber-500'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  }`}
                  style={{ width: `${(tokensRemaining / maxTokens) * 100}%` }}
                />
              </div>

              <p className="mt-2 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                <span>Algorithm: Leaky Bucket / Token Bucket</span>
                <span>Refill: +1 token every 2.5s</span>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Console Output & Cryptographic JWT Inspector (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Tab Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('console')}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'console'
                      ? 'border border-red-500/60 bg-red-950/40 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5 text-red-500" />
                  API Response Console
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('jwt')}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'jwt'
                      ? 'border border-red-500/60 bg-red-950/40 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Key className="h-3.5 w-3.5 text-amber-400" />
                  Decoded JWT Claims
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('schema')}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'schema'
                      ? 'border border-red-500/60 bg-red-950/40 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Database className="h-3.5 w-3.5 text-sky-400" />
                  PostgreSQL Index Plan
                </button>
              </div>

              <span className="font-mono text-[11px] text-neutral-500 hidden sm:inline">
                Live Memory State
              </span>
            </div>

            {/* Tab 1: API Response Console */}
            {activeTab === 'console' && (
              <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] text-neutral-400 ml-1">
                      HTTP/2 Response Terminal
                    </span>
                  </div>
                  <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] text-neutral-400">
                    STATUS:{' '}
                    <strong
                      className={
                        (lastResponse.code as number) === 200
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }
                    >
                      {String(lastResponse.code || lastResponse.statusCode || 200)}
                    </strong>
                  </span>
                </div>

                <pre className="max-h-[290px] overflow-y-auto text-[11px] leading-relaxed text-emerald-300 bg-black/75 p-3 rounded-lg border border-white/5">
                  {JSON.stringify(lastResponse, null, 2)}
                </pre>

                {/* Audit Event Ledger Below Response */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-2 flex items-center justify-between">
                    <span>Recent Request Ledger:</span>
                    <span>Max retention: 8 entries</span>
                  </p>
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                    {logs.map((lg) => (
                      <div
                        key={lg.id}
                        className="flex items-center justify-between text-[10px] rounded bg-white/[0.02] px-2.5 py-1 text-neutral-300 font-mono"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={
                              lg.status === 200
                                ? 'text-emerald-400 font-bold'
                                : lg.status === 403
                                ? 'text-amber-400 font-bold'
                                : 'text-rose-400 font-bold'
                            }
                          >
                            [{lg.status}]
                          </span>
                          <span className="text-neutral-400">{lg.timestamp}</span>
                          <span className="text-white truncate">{lg.endpoint}</span>
                        </div>
                        <span className="text-neutral-500 shrink-0 ml-2">{lg.latencyMs}ms</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Decoded JWT Claims */}
            {activeTab === 'jwt' && (
              <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-neutral-400 border-b border-white/10 pb-2">
                  <span className="text-amber-400 font-bold">JWT HMAC-SHA256 TOKEN CLAIMS</span>
                  <span className="text-[10px]">Algorithm: HS256</span>
                </div>

                <div>
                  <p className="text-[10px] text-red-400 font-bold uppercase mb-1">
                    HEADER: ALGORITHM &amp; TOKEN TYPE
                  </p>
                  <pre className="bg-black/70 p-2.5 rounded border border-white/5 text-[11px] text-neutral-300">
                    {JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2)}
                  </pre>
                </div>

                <div>
                  <p className="text-[10px] text-purple-400 font-bold uppercase mb-1">
                    PAYLOAD: DATA &amp; ROLE CLAIMS
                  </p>
                  <pre className="bg-black/70 p-2.5 rounded border border-white/5 text-[11px] text-neutral-200">
                    {JSON.stringify(
                      {
                        ...currentRoleConfig.tokenPayload,
                        iat: sessionTimestamp - 120,
                        exp: sessionTimestamp + 3600,
                        iss: 'auth.rj-portfolio.net',
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>

                <div>
                  <p className="text-[10px] text-cyan-400 font-bold uppercase mb-1">
                    VERIFY SIGNATURE
                  </p>
                  <div className="bg-black/70 p-2 rounded border border-white/5 text-[10px] text-neutral-500 truncate">
                    HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret_key)
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: PostgreSQL Index Plan */}
            {activeTab === 'schema' && (
              <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-neutral-400 border-b border-white/10 pb-2">
                  <span className="text-sky-400 font-bold">
                    POSTGRESQL EXPLAIN ANALYZE (CereTax Engine)
                  </span>
                  <span className="text-[10px] text-emerald-400">Execution: 4.12ms</span>
                </div>

                <pre className="bg-black/75 p-3 rounded-lg border border-white/5 text-[11px] leading-relaxed text-sky-200 overflow-x-auto">
{`-- High-throughput tax rate lookup query
EXPLAIN ANALYZE
SELECT 
  j.jurisdiction_code,
  j.state_code,
  r.tax_rate,
  r.effective_date,
  r.statute_ref
FROM tax_jurisdictions j
JOIN tax_rules r ON j.id = r.jurisdiction_id
WHERE j.geo_hash = 'dr5ru'
  AND r.taxability_code = 'SAAS_DIGITAL_01'
  AND r.is_active = TRUE;

-> Index Scan using idx_jurisdictions_geohash on tax_jurisdictions (cost=0.42..8.45 rows=1)
   Index Cond: (geo_hash = 'dr5ru'::text)
-> Nested Loop (cost=0.85..16.92 rows=14)
   -> Index Scan using idx_rules_taxability on tax_rules (cost=0.43..8.47 rows=1)
Planning Time: 0.184 ms
Execution Time: 4.122 ms`}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
