import api from './api';

export const driverService = {
  getAll: (params) => api.get('/drivers', { params }).then((r) => r.data),
  getById: (id) => api.get(`/drivers/${id}`).then((r) => r.data),
  getAvailable: () => api.get('/drivers/available/list').then((r) => r.data),
  getExpiring: () => api.get('/drivers/expiring/list').then((r) => r.data),
  create: (payload) => api.post('/drivers', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/drivers/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/drivers/${id}`).then((r) => r.data),
};
