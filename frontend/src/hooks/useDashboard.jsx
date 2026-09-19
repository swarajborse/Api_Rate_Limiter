import { createContext, useContext, useState, useCallback } from 'react';
import { clientApi } from '../api/clientApi';
import { rateLimiterApi } from '../api/rateLimiterApi';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [stats, setStats] = useState({
    totalRequests: 0,
    allowedRequests: 0,
    blockedRequests: 0,
    currentTokens: 0,
    maxTokens: 0,
    rps: 0,
    activeClients: 0,
  });

  const [requestHistory, setRequestHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [backendConnected, setBackendConnected] = useState(true);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const loadClients = useCallback(async (silent = false) => {
    try {
      const data = await clientApi.getAll();
      setClients(data);
      setStats((prev) => ({ ...prev, activeClients: data.filter((c) => c.enabled).length }));
      setBackendConnected(true);
    } catch (err) {
      setBackendConnected(false);
      if (!silent) {
        showToast(err.message || 'Failed to load clients', 'error');
      }
    }
  }, [showToast]);

  const sendRequest = useCallback(async (clientId, cost = 1) => {
    setLoading(true);
    const start = performance.now();
    try {
      const response = await rateLimiterApi.checkRateLimit({ clientId, requestCost: cost });
      const elapsed = Math.round(performance.now() - start);
      const entry = {
        id: Date.now(),
        clientId,
        endpoint: '/api/v1/rate-limit/check',
        method: 'POST',
        status: response.allowed ? 'ALLOWED' : 'BLOCKED',
        remainingTokens: response.remainingTokens,
        retryAfterMillis: response.retryAfterMillis,
        responseTime: elapsed,
        timestamp: new Date().toISOString(),
      };

      setRequestHistory((prev) => [entry, ...prev].slice(0, 200));

      setStats((prev) => {
        const totalRequests = prev.totalRequests + 1;
        const allowedRequests = prev.allowedRequests + (response.allowed ? 1 : 0);
        const blockedRequests = prev.blockedRequests + (response.allowed ? 0 : 1);
        return { ...prev, totalRequests, allowedRequests, blockedRequests, currentTokens: response.remainingTokens };
      });

      const now = new Date();
      const timeLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setChartData((prev) => {
        const existing = prev.find((d) => d.time === timeLabel);
        if (existing) {
          existing.allowed += response.allowed ? 1 : 0;
          existing.blocked += response.allowed ? 0 : 1;
          return [...prev];
        }
        return [
          ...prev.slice(-30),
          {
            time: timeLabel,
            allowed: response.allowed ? 1 : 0,
            blocked: response.allowed ? 0 : 1,
            tokens: response.remainingTokens,
          },
        ];
      });

      return { response, entry };
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      const entry = {
        id: Date.now(),
        clientId,
        endpoint: '/api/v1/rate-limit/check',
        method: 'POST',
        status: 'ERROR',
        remainingTokens: 0,
        retryAfterMillis: 0,
        responseTime: elapsed,
        timestamp: new Date().toISOString(),
        error: err.message,
      };
      setRequestHistory((prev) => [entry, ...prev].slice(0, 200));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        stats,
        setStats,
        requestHistory,
        setRequestHistory,
        chartData,
        clients,
        setClients,
        selectedClient,
        setSelectedClient,
        loading,
        toast,
        showToast,
        loadClients,
        sendRequest,
        backendConnected,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
