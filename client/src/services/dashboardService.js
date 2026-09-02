import api from './api';

export const dashboardService = {
  getKpis: () => api.get('/dashboard/kpis').then((r) => r.data),
  getCharts: () => api.get('/dashboard/charts').then((r) => r.data),
  getRecentTrips: () => api.get('/dashboard/recent-trips').then((r) => r.data),
};

export const reportService = {
  getAnalytics: () => api.get('/reports/analytics').then((r) => r.data),
  exportCsvUrl: () => `${import.meta.env.VITE_API_URL || ''}/api/reports/export/csv`,
};
