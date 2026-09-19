import api from './axios';

const BASE = '/api/v1/clients';

export const clientApi = {
  getAll: () => api.get(BASE).then((r) => r.data),

  getById: (clientId) => api.get(`${BASE}/${clientId}`).then((r) => r.data),

  create: (data) => api.post(BASE, data).then((r) => r.data),

  update: (clientId, data) => api.put(`${BASE}/${clientId}`, data).then((r) => r.data),

  deactivate: (clientId) => api.patch(`${BASE}/${clientId}/deactivate`).then((r) => r.data),

  delete: (clientId) => api.delete(`${BASE}/${clientId}`),

  getBucketState: (clientId) => api.get(`${BASE}/${clientId}/bucket`).then((r) => r.data),
};
