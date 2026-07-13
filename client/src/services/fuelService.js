import api from './api';

export const fuelService = {
  getAll: (params) => api.get('/fuel', { params }).then((r) => r.data),
  create: (payload) => api.post('/fuel', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/fuel/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/fuel/${id}`).then((r) => r.data),
};

export const expenseService = {
  getAll: (params) => api.get('/expenses', { params }).then((r) => r.data),
  create: (payload) => api.post('/expenses', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/expenses/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/expenses/${id}`).then((r) => r.data),
};
