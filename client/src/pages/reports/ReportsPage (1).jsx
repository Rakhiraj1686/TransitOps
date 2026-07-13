import React, { useEffect, useState } from 'react';
import { FiDownload, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import { CardSkeleton, TableSkeleton } from '../../components/loaders/Skeleton';
import { reportService } from '../../services/dashboardService';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import api from '../../services/api';

const ReportsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    reportService
      .getAnalytics()
      .then((res) => setAnalytics(res.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get('/reports/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transitops_vehicle_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report exported');
    } catch {
      toast.error('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Analytics</p>
          <h1 className="font-display text-xl font-bold sm:text-2xl lg:text-3xl">Reports</h1>
          <p className="mt-1 text-sm text-muted">Fleet utilization, fuel efficiency, operational cost &amp; ROI</p>
        </div>
        <Button icon={FiDownload} onClick={handleExport} loading={exporting} variant="secondary" className="w-full sm:w-auto">
          Export CSV
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Fleet Utilization</p>
            <p className="font-display mt-2 text-3xl font-semibold data-mono">{analytics.fleetUtilization}%</p>
            <p className="mt-1 text-xs text-muted">Vehicles currently On Trip vs total fleet</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Total Maintenance Spend</p>
            <p className="font-display mt-2 text-3xl font-semibold data-mono">
              {formatCurrency(analytics.maintenanceSummary.reduce((s, m) => s + m.totalCost, 0))}
            </p>
            <p className="mt-1 text-xs text-muted">Across all logged service records</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Completed Trips</p>
            <p className="font-display mt-2 text-3xl font-semibold data-mono">
              {formatNumber(analytics.tripsSummary.find((t) => t.status === 'Completed')?.count || 0)}
            </p>
            <p className="mt-1 text-xs text-muted">Total trips delivered successfully</p>
          </Card>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line p-5 dark:border-white/10">
          <FiTrendingUp className="h-4 w-4 text-accent" />
          <h3 className="font-display text-base font-semibold">Per-Vehicle ROI &amp; Efficiency</h3>
        </div>

        {loading ? (
          <div className="p-5">
            <TableSkeleton rows={8} cols={7} />
          </div>
        ) : (
          <>
            {/* Mobile / tablet: stacked cards */}
            <div className="divide-y divide-line md:hidden dark:divide-white/5">
              {analytics.vehicleAnalytics.map((v) => (
                <div key={v.vehicleId} className="space-y-2.5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="data-mono text-xs font-semibold">{v.registrationNumber}</span>
                    <span className={`text-sm font-semibold ${v.roiPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {v.roiPercent}% ROI
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted">
                    <span>{v.totalTrips} trips</span>
                    <span>{formatNumber(v.totalDistanceKm)} km</span>
                    <span>{v.fuelEfficiencyKmPerLtr || '—'} km/L</span>
                    <span>Cost {formatCurrency(v.operationalCost)}</span>
                    <span className="col-span-2">Revenue {formatCurrency(v.totalRevenue)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: full table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-muted dark:border-white/10">
                    <th className="px-5 py-3 font-medium">Vehicle</th>
                    <th className="px-5 py-3 font-medium">Trips</th>
                    <th className="px-5 py-3 font-medium">Distance</th>
                    <th className="px-5 py-3 font-medium">Fuel Efficiency</th>
                    <th className="px-5 py-3 font-medium">Operational Cost</th>
                    <th className="px-5 py-3 font-medium">Revenue</th>
                    <th className="px-5 py-3 font-medium">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.vehicleAnalytics.map((v) => (
                    <tr key={v.vehicleId} className="border-b border-line last:border-0 dark:border-white/5">
                      <td className="px-5 py-3.5 data-mono text-xs font-semibold">{v.registrationNumber}</td>
                      <td className="px-5 py-3.5">{v.totalTrips}</td>
                      <td className="px-5 py-3.5">{formatNumber(v.totalDistanceKm)} km</td>
                      <td className="px-5 py-3.5">{v.fuelEfficiencyKmPerLtr || '—'} km/L</td>
                      <td className="px-5 py-3.5">{formatCurrency(v.operationalCost)}</td>
                      <td className="px-5 py-3.5">{formatCurrency(v.totalRevenue)}</td>
                      <td className={`px-5 py-3.5 font-semibold ${v.roiPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {v.roiPercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ReportsPage;
