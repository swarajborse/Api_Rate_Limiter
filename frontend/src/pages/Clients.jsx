import { useEffect, useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { clientApi } from '../api/clientApi';
import ClientCard from '../components/ClientCard';

export default function Clients() {
  const { clients, loadClients, showToast } = useDashboard();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ clientId: '', capacity: 100, refillRate: 10, enabled: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClients(true);
  }, [loadClients]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.clientId.trim()) {
      showToast('Client ID is required', 'error');
      return;
    }
    setSaving(true);
    try {
      await clientApi.create(form);
      showToast(`Client "${form.clientId}" created`);
      setShowModal(false);
      setForm({ clientId: '', capacity: 100, refillRate: 10, enabled: true });
      loadClients();
    } catch (err) {
      showToast(err.message || 'Failed to create client', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">Clients</h1>
          <p className="text-sm text-dark-400 mt-1">
            Configure rate-limited API clients
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Client
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="bg-dark-700 border border-dark-600 rounded-xl p-12 text-center">
          <p className="text-dark-400">No clients configured yet</p>
          <p className="text-dark-500 text-sm mt-1">Create a client to start rate limiting</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-dark-700 border border-dark-600 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-dark-100 mb-4">Create Client</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-dark-400 mb-1 font-medium">Client ID</label>
                <input
                  type="text"
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  placeholder="e.g. client-123"
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-dark-400 mb-1 font-medium">Capacity</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1 font-medium">Refill Rate (tok/s)</label>
                  <input
                    type="number"
                    value={form.refillRate}
                    onChange={(e) => setForm({ ...form, refillRate: parseInt(e.target.value) || 0 })}
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm text-dark-300">Enabled</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-dark-600 hover:bg-dark-500 text-dark-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
