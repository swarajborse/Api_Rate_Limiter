import { useState, useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { clientApi } from '../api/clientApi';
import TokenBucket from '../components/TokenBucket';
import RequestStatus from '../components/RequestStatus';

export default function RequestTester() {
  const { clients, loadClients, sendRequest, loading, showToast } = useDashboard();
  const [clientId, setClientId] = useState('');
  const [method, setMethod] = useState('POST');
  const [endpoint, setEndpoint] = useState('/api/v1/rate-limit/check');
  const [body, setBody] = useState('');
  const [cost, setCost] = useState(1);
  const [lastResult, setLastResult] = useState(null);
  const [bucket, setBucket] = useState(null);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    if (clientId) {
      clientApi.getBucketState(clientId).then(setBucket).catch(() => {});
    }
  }, [clientId, lastResult]);

  const handleSend = async () => {
    if (!clientId.trim()) {
      showToast('Select or enter a Client ID', 'error');
      return;
    }

    try {
      const result = await sendRequest(clientId, cost);
      setLastResult(result.entry);
      showToast(
        result.response.allowed ? 'Request Allowed' : 'Rate Limited',
        result.response.allowed ? 'success' : 'error'
      );
    } catch (err) {
      setLastResult({
        id: Date.now(),
        clientId,
        endpoint,
        method,
        status: 'ERROR',
        remainingTokens: 0,
        retryAfterMillis: 0,
        responseTime: 0,
        timestamp: new Date().toISOString(),
        error: err.message,
      });
      showToast(err.message || 'Request failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Request Tester</h1>
        <p className="text-sm text-dark-400 mt-1">
          Send requests through the rate limiter endpoint
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dark-700 border border-dark-600 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs text-dark-400 mb-1 font-medium">Client ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter or select client"
                className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Select...</option>
                {clients.map((c) => (
                  <option key={c.clientId} value={c.clientId}>
                    {c.clientId}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-dark-400 mb-1 font-medium">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option>POST</option>
                <option>GET</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-dark-400 mb-1 font-medium">Endpoint</label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-dark-400 mb-1 font-medium">Request Cost (tokens)</label>
            <input
              type="number"
              min="1"
              value={cost}
              onChange={(e) => setCost(parseInt(e.target.value) || 1)}
              className="w-32 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-dark-400 mb-1 font-medium">Request Body (optional)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder='{"key": "value"}'
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 font-mono placeholder:text-dark-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={loading || !clientId.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-dark-600 disabled:text-dark-400 text-white px-4 py-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⟳</span> Sending...
              </>
            ) : (
              '▸ Send Request'
            )}
          </button>
        </div>

        <div className="space-y-6">
          <TokenBucket
            currentTokens={bucket?.availableTokens || 0}
            maxTokens={
              clients.find((c) => c.clientId === clientId)?.capacity || 100
            }
          />

          {lastResult && <RequestStatus entry={lastResult} />}
        </div>
      </div>
    </div>
  );
}
