import { useDashboard } from '../hooks/useDashboard';

export default function Navbar() {
  const { stats, backendConnected } = useDashboard();

  return (
    <header className="h-14 bg-dark-800/80 backdrop-blur-sm border-b border-dark-600 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <span className="text-dark-300 text-sm">Distributed API Rate Limiter</span>
        <span className="text-dark-600">|</span>
        <span className="text-dark-400 text-xs font-mono">Token Bucket Algorithm</span>
      </div>
      <div className="flex items-center gap-4">
        {!backendConnected && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            <span className="text-xs text-amber-400 font-medium">Backend offline — start Spring Boot on :8080</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-dark-500'}`}></div>
          <span className="text-xs text-dark-300">Redis Lua Atomic</span>
        </div>
        <div className="bg-dark-700 rounded-md px-3 py-1.5">
          <span className="text-xs text-dark-300 font-mono">
            {stats.totalRequests} requests
          </span>
        </div>
      </div>
    </header>
  );
}
