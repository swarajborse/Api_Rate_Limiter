import { Link, useLocation } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { path: '/clients', label: 'Clients', icon: '⊞' },
  { path: '/request-tester', label: 'Request Tester', icon: '▸' },
  { path: '/request-history', label: 'Request History', icon: '≡' },
];

export default function Sidebar() {
  const location = useLocation();
  const { stats, backendConnected } = useDashboard();

  return (
    <aside className="w-64 bg-dark-800 border-r border-dark-600 flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-5 border-b border-dark-600">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 text-lg font-bold">⚡</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-dark-50 tracking-tight">Rate Limiter</h1>
            <p className="text-[11px] text-dark-400 font-medium">Token Bucket Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/clients' && location.pathname.startsWith('/clients'));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-dark-300 hover:text-dark-100 hover:bg-dark-700'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-dark-600">
        <div className="bg-dark-700 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-dark-400">System</span>
            <span className={`${backendConnected ? 'text-emerald-400' : 'text-amber-400'} font-medium`}>
              {backendConnected ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-dark-400">Redis</span>
            <span className={`${backendConnected ? 'text-emerald-400' : 'text-dark-500'} font-medium`}>
              {backendConnected ? 'Connected' : 'Unreachable'}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-dark-400">Clients</span>
            <span className="text-dark-200 font-medium">{stats.activeClients}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
