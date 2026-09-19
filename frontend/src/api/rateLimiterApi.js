import api from './axios';

const BASE = '/api/v1/rate-limit';

export const rateLimiterApi = {
  checkRateLimit: (data) => api.post(`${BASE}/check`, data).then((r) => r.data),
};
