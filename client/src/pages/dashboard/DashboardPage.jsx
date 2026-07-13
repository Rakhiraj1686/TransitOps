import React, { useEffect, useState } from 'react';
import { FiTruck, FiCheckCircle, FiTool, FiUsers, FiActivity, FiClock } from 'react-icons/fi';
import KpiCard from '../../components/dashboard/KpiCard';
import VehicleStatusChart from '../../components/charts/VehicleStatusChart';
import MonthlyTripsChart from '../../components/charts/MonthlyTripsChart';
import MonthlyExpensesChart from '../../components/charts/MonthlyExpensesChart';
import FuelConsumptionChart from '../../components/charts/FuelConsumptionChart';
import { Card } from '../../components/ui/Primitives';
import StatusBadge from '../../components/ui/StatusBadge';
import { CardSkeleton, TableSkeleton } from '../../components/loaders/Skeleton';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardService.getKpis(), dashboardService.getCharts(), dashboardService.getRecentTrips()])
      .then(([k, c, t]) => {
        setKpis(k.data);
        setCharts(c.data);
        setRecentTrips(t.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Operations overview</p>
          <h1 className="font-display text-xl font-bold sm:text-2xl lg:text-3xl">Good to see you, {user?.name?.split(' ')[0]}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            to="/trips"
            className="focus-ring w-full rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-medium text-white shadow-soft hover:bg-accent-dark sm:w-auto"
          >
            + New Trip
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <KpiCard label="Active Vehicles" value={kpis.activeVehicles} icon={FiTruck} accent="accent" delay={0} />
          <KpiCard label="Available Vehicles" value={kpis.availableVehicles} icon={FiCheckCircle} accent="teal" delay={0.05} />
          <KpiCard label="In Maintenance" value={kpis.maintenanceVehicles} icon={FiTool} accent="ink" delay={0.1} />
          <KpiCard label="Drivers On Duty" value={kpis.driversOnDuty} icon={FiUsers} accent="accent" delay={0.15} />
          <KpiCard label="Fleet Utilization" value={kpis.fleetUtilization} suffix="%" icon={FiActivity} accent="teal" delay={0.2} />
          <KpiCard label="Active Trips" value={kpis.activeTrips} icon={FiActivity} accent="accent" delay={0.25} />
          <KpiCard label="Pending Trips" value={kpis.pendingTrips} icon={FiClock} accent="ink" delay={0.3} />
          <KpiCard label="Total Drivers" value={kpis.totalDrivers} icon={FiUsers} accent="teal" delay={0.35} />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <VehicleStatusChart data={charts.vehicleStatus} />
          <MonthlyTripsChart data={charts.monthlyTrips} />
          <MonthlyExpensesChart data={charts.monthlyExpenses} />
          <FuelConsumptionChart data={charts.monthlyFuel} />
        </div>
      )}


      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-4 sm:p-5 dark:border-white/10">
          <h3 className="font-display text-base font-semibold">Recent Trips</h3>
          <Link to="/trips" className="text-xs font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="p-5">
            <TableSkeleton rows={5} cols={5} />
          </div>
        ) : (
          <>
            {/* Mobile / tablet: stacked cards (avoids horizontal scrolling on small screens) */}
            <div className="divide-y divide-line md:hidden dark:divide-white/5">
              {recentTrips.map((trip) => (
                <div key={trip._id} className="space-y-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="data-mono text-xs font-medium">{trip.tripCode}</span>
                    <StatusBadge status={trip.status} />
                  </div>
                  <div className="text-sm">
                    {trip.source} <span className="text-muted">→</span> {trip.destination}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted">
                    <span>{trip.vehicle?.registrationNumber || '—'}</span>
                    <span>{trip.driver?.name || '—'}</span>
                    <span>{formatDate(trip.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: full table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-muted dark:border-white/10">
                    <th className="px-5 py-3 font-medium">Trip</th>
                    <th className="px-5 py-3 font-medium">Route</th>
                    <th className="px-5 py-3 font-medium">Vehicle</th>
                    <th className="px-5 py-3 font-medium">Driver</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map((trip) => (
                    <tr key={trip._id} className="border-b border-line last:border-0 dark:border-white/5">
                      <td className="px-5 py-3.5 data-mono text-xs font-medium">{trip.tripCode}</td>
                      <td className="px-5 py-3.5">
                        {trip.source} <span className="text-muted">→</span> {trip.destination}
                      </td>
                      <td className="px-5 py-3.5">{trip.vehicle?.registrationNumber || '—'}</td>
                      <td className="px-5 py-3.5">{trip.driver?.name || '—'}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={trip.status} />
                      </td>
                      <td className="px-5 py-3.5 text-muted">{formatDate(trip.createdAt)}</td>
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

export default DashboardPage;
