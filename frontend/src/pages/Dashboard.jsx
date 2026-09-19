import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { clientApi } from '../api/clientApi';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { stats, chartData, clients, loadClients, requestHistory } = useDashboard();

  useEffect(() => {
    loadClients(true);
  }, [loadClients]);

  const rps = requestHistory.length > 0
    ? (() => {
        const now = Date.now();
        const oneSecAgo = now - 1000;
        return requestHistory.filter((r) => new Date(r.timestamp).getTime() > oneSecAgo).length;
      })()
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Dashboard</h1>
        <p className="text-sm text-dark-400 mt-1">
          Real-time rate limiter monitoring · Token Bucket · Redis Lua Atomic
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Requests" value={stats.totalRequests} color="blue" sub="All time" />
        <StatCard label="Allowed" value={stats.allowedRequests} color="emerald" sub="Passed through" />
        <StatCard label="Blocked" value={stats.blockedRequests} color="red" sub="Rate limited" />
        <StatCard label="Remaining Tokens" value={stats.currentTokens} color="amber" sub="Current bucket" />
        <StatCard label="Requests/Sec" value={rps} color="purple" sub="Current rate" />
        <StatCard label="Active Clients" value={stats.activeClients} color="cyan" sub="Registered" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dark-700 border border-dark-600 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-dark-200 mb-4 uppercase tracking-wider">
            Request Activity
          </h3>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-dark-400 text-sm">
              No data yet. Send requests from the Request Tester.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="allowed" name="Allowed" radius={[2, 2, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="#34d399" />
                  ))}
                </Bar>
                <Bar dataKey="blocked" name="Blocked" radius={[2, 2, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="#f87171" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-dark-700 border border-dark-600 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-dark-200 mb-4 uppercase tracking-wider">
            Recent Activity
          </h3>
          {requestHistory.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-dark-400 text-sm">
              No requests yet
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
              {requestHistory.slice(0, 10).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-2 text-xs bg-dark-800 rounded-lg p-2"
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      r.status === 'ALLOWED'
                        ? 'bg-emerald-400'
                        : r.status === 'BLOCKED'
                        ? 'bg-red-400'
                        : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-dark-300 font-mono truncate">{r.clientId}</span>
                  <span
                    className={`ml-auto font-semibold ${
                      r.status === 'ALLOWED' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-dark-700 border border-dark-600 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-dark-200 mb-4 uppercase tracking-wider">
          System Architecture
        </h3>
        <div className="flex flex-col items-center gap-1 font-mono text-sm">
          <ArchitectureNode label="Client" sub="HTTP Requests" color="bg-blue-500/20 text-blue-400 border-blue-500/30" />
          <Arrow />
          <ArchitectureNode label="Spring Boot API" sub="REST Controller" color="bg-purple-500/20 text-purple-400 border-purple-500/30" />
          <Arrow />
          <ArchitectureNode label="RateLimiterService" sub="Business Logic" color="bg-amber-500/20 text-amber-400 border-amber-500/30" />
          <Arrow />
          <ArchitectureNode label="Redis + Lua Script" sub="Atomic Token Bucket" color="bg-red-500/20 text-red-400 border-red-500/30" />
          <Arrow />
          <div className="flex gap-4">
            <ArchitectureNode label="✓ ALLOW" sub="200 OK" color="bg-emerald-500/20 text-emerald-400 border-emerald-500/30" />
            <ArchitectureNode label="✕ BLOCK" sub="429 Too Many" color="bg-red-500/20 text-red-400 border-red-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureNode({ label, sub, color }) {
  return (
    <div className={`border rounded-lg px-5 py-2.5 text-center ${color}`}>
      <p className="font-bold">{label}</p>
      <p className="text-[11px] opacity-70">{sub}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="text-dark-500 text-lg leading-none">↓</div>
  );
}
