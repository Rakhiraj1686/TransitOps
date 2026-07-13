import api from './api';

export const tripService = {
  getAll: (params) => api.get('/trips', { params }).then((r) => r.data),
  getById: (id) => api.get(`/trips/${id}`).then((r) => r.data),
  create: (payload) => api.post('/trips', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/trips/${id}`, payload).then((r) => r.data),
  dispatch: (id) => api.patch(`/trips/${id}/dispatch`).then((r) => r.data),
  complete: (id, payload) => api.patch(`/trips/${id}/complete`, payload).then((r) => r.data),
  cancel: (id, payload) => api.patch(`/trips/${id}/cancel`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/trips/${id}`).then((r) => r.data),
};
