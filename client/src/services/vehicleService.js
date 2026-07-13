import api from './api';

export const vehicleService = {
  getAll: (params) => api.get('/vehicles', { params }).then((r) => r.data),
  getById: (id) => api.get(`/vehicles/${id}`).then((r) => r.data),
  getAvailable: () => api.get('/vehicles/available/list').then((r) => r.data),
  create: (payload) => api.post('/vehicles', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/vehicles/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/vehicles/${id}`).then((r) => r.data),
};
