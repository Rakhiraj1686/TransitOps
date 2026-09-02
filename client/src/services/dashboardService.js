import api from './api';

const apiOrigin = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://transitops-fkvl.onrender.com' : '');

export const dashboardService = {
  getKpis: () => api.get('/dashboard/kpis').then((r) => r.data),
  getCharts: () => api.get('/dashboard/charts').then((r) => r.data),
  getRecentTrips: () => api.get('/dashboard/recent-trips').then((r) => r.data),
};

export const reportService = {
  getAnalytics: () => api.get('/reports/analytics').then((r) => r.data),
  exportCsvUrl: () => `${apiOrigin}/api/reports/export/csv`,
};
