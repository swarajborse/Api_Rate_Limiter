import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { clientApi } from '../api/clientApi';
import TokenBucket from '../components/TokenBucket';
import StatCard from '../components/StatCard';

export default function ClientDetails() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { requestHistory, showToast, sendRequest } = useDashboard();

  const [client, setClient] = useState(null);
  const [bucket, setBucket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  const loadData = useCallback(async () => {
    try {
      const [clientData, bucketData] = await Promise.all([
        clientApi.getById(clientId),
        clientApi.getBucketState(clientId),
      ]);
      setClient(clientData);
      setBucket(bucketData);
      setEditForm({ capacity: clientData.capacity, refillRate: clientData.refillRate, enabled: clientData.enabled });
    } catch {
      showToast('Client not found', 'error');
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  }, [clientId, showToast, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const clientHistory = requestHistory.filter((r) => r.clientId === clientId);
  const allowed = clientHistory.filter((r) => r.status === 'ALLOWED').length;
  const blocked = clientHistory.filter((r) => r.status === 'BLOCKED').length;

  const chartData = clientHistory.slice(-20).map((r, i) => ({
    idx: i + 1,
    allowed: r.status === 'ALLOWED' ? 1 : 0,
    blocked: r.status === 'BLOCKED' ? 1 : 0,
    tokens: r.remainingTokens,
  }));

  const handleQuickRequest = async () => {
    setSending(true);
    try {
      await sendRequest(clientId, 1);
      const newBucket = await clientApi.getBucketState(clientId);
      setBucket(newBucket);
      showToast('Request sent');
    } catch (err) {
      showToast(err.message || 'Request failed', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleSave = async () => {
    try {
      await clientApi.update(clientId, editForm);
      showToast('Client updated');
      setEditMode(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this client?')) return;
    try {
      await clientApi.delete(clientId);
      showToast('Client deleted');
      navigate('/clients');
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleToggle = async () => {
    try {
      if (client.enabled) {
        await clientApi.deactivate(clientId);
        showToast('Client deactivated');
      } else {
        await clientApi.update(clientId, { ...editForm, enabled: true });
        showToast('Client activated');
      }
      loadData();
    } catch (err) {
      showToast(err.message || 'Toggle failed', 'error');
    }
  };

  if (loading) {
    return <div className="text-dark-400 text-sm py-12 text-center">Loading client...</div>;
  }

  if (!client) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/clients')}
          className="text-dark-400 hover:text-dark-200 text-sm"
        >
          ← Back
        </button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50 font-mono">{client.clientId}</h1>
          <p className="text-sm text-dark-400 mt-1">
            Algorithm: {client.algorithm} · {client.enabled ? 'Active' : 'Disabled'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleQuickRequest}
            disabled={sending || !client.enabled}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Test Request'}
          </button>
          <button
            onClick={handleToggle}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              client.enabled
                ? 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30'
                : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
            }`}
          >
            {client.enabled ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-dark-600 hover:bg-dark-500 text-dark-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600/20 text-red-400 hover:bg-red-600/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {editMode && (
        <div className="bg-dark-700 border border-dark-600 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-dark-200 mb-3">Edit Configuration</h3>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-xs text-dark-400 mb-1">Capacity</label>
              <input
                type="number"
                value={editForm.capacity}
                onChange={(e) => setEditForm({ ...editForm, capacity: parseInt(e.target.value) || 0 })}
                className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-28"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Refill Rate</label>
              <input
                type="number"
                value={editForm.refillRate}
                onChange={(e) => setEditForm({ ...editForm, refillRate: parseInt(e.target.value) || 0 })}
                className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-28"
              />
            </div>
            <button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Capacity" value={client.capacity} color="blue" sub="Max tokens" />
        <StatCard label="Refill Rate" value={`${client.refillRate}/s`} color="purple" sub="Tokens/sec" />
        <StatCard label="Total Requests" value={clientHistory.length} color="cyan" sub="This client" />
        <StatCard label="Allowed" value={allowed} color="emerald" sub="Passed" />
        <StatCard label="Blocked" value={blocked} color="red" sub="Throttled" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenBucket
          currentTokens={bucket?.availableTokens || 0}
          maxTokens={client.capacity}
        />

        <div className="bg-dark-700 border border-dark-600 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-dark-200 mb-4 uppercase tracking-wider">
            Request Activity
          </h3>
          {chartData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-dark-400 text-sm">
              No requests yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartData}>
                <XAxis dataKey="idx" tick={{ fill: '#64748b', fontSize: 10 }} />
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
                <Bar dataKey="allowed" name="Allowed" fill="#34d399" radius={[2, 2, 0, 0]} />
                <Bar dataKey="blocked" name="Blocked" fill="#f87171" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
