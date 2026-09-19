import { useState } from 'react';
import { formatTimestamp } from '../utils/formatters';

export default function RequestTable({ history, clients }) {
  const [search, setSearch] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  let filtered = history;

  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.clientId.toLowerCase().includes(search.toLowerCase()) ||
        r.endpoint.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filterClient) {
    filtered = filtered.filter((r) => r.clientId === filterClient);
  }

  if (filterStatus) {
    filtered = filtered.filter((r) => r.status === filterStatus);
  }

  filtered = [...filtered].sort((a, b) => {
    const diff = new Date(a.timestamp) - new Date(b.timestamp);
    return sortDesc ? -diff : diff;
  });

  const uniqueClients = [...new Set(history.map((r) => r.clientId))];

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 placeholder:text-dark-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1 min-w-[150px]"
        />
        <select
          value={filterClient}
          onChange={(e) => setFilterClient(e.target.value)}
          className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="">All Clients</option>
          {uniqueClients.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="">All Status</option>
          <option value="ALLOWED">ALLOWED</option>
          <option value="BLOCKED">BLOCKED</option>
          <option value="ERROR">ERROR</option>
        </select>
        <button
          onClick={() => setSortDesc(!sortDesc)}
          className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 hover:bg-dark-600 transition-colors"
        >
          {sortDesc ? '↓ Newest' : '↑ Oldest'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-600">
              <th className="text-left py-3 px-4 text-dark-400 font-medium">Time</th>
              <th className="text-left py-3 px-4 text-dark-400 font-medium">Client</th>
              <th className="text-left py-3 px-4 text-dark-400 font-medium">Endpoint</th>
              <th className="text-left py-3 px-4 text-dark-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-dark-400 font-medium">Remaining</th>
              <th className="text-left py-3 px-4 text-dark-400 font-medium">Response Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-dark-400">
                  No requests recorded yet
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b border-dark-700 hover:bg-dark-700/50">
                  <td className="py-3 px-4 text-dark-200 font-mono text-xs">
                    {formatTimestamp(r.timestamp)}
                  </td>
                  <td className="py-3 px-4 text-dark-200 font-mono text-xs">{r.clientId}</td>
                  <td className="py-3 px-4 text-dark-300 font-mono text-xs">{r.endpoint}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        r.status === 'ALLOWED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : r.status === 'BLOCKED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-dark-200 font-mono text-xs">{r.remainingTokens}</td>
                  <td className="py-3 px-4 text-dark-300 text-xs">{r.responseTime}ms</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
