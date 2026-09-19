import { Link } from 'react-router-dom';

export default function ClientCard({ client }) {
  return (
    <Link
      to={`/clients/${client.clientId}`}
      className="block bg-dark-700 border border-dark-600 rounded-xl p-5 hover:border-emerald-500/30 transition-all hover:bg-dark-700/80"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-dark-100 font-mono">{client.clientId}</h3>
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${
            client.enabled
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {client.enabled ? 'Active' : 'Disabled'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-dark-800 rounded-lg p-2">
          <p className="text-dark-400">Capacity</p>
          <p className="text-dark-100 font-bold">{client.capacity}</p>
        </div>
        <div className="bg-dark-800 rounded-lg p-2">
          <p className="text-dark-400">Refill Rate</p>
          <p className="text-dark-100 font-bold">{client.refillRate}/s</p>
        </div>
      </div>

      <p className="text-[11px] text-dark-400 mt-3">
        Algorithm: {client.algorithm} · Created {new Date(client.createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
