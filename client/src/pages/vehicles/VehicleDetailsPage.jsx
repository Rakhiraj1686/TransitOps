import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMap, FiTool, FiDroplet, FiTruck } from 'react-icons/fi';
import { Card } from '../../components/ui/Primitives';
import StatusBadge from '../../components/ui/StatusBadge';
import { PageLoader } from '../../components/loaders/Skeleton';
import { vehicleService } from '../../services/vehicleService';
import { formatCurrency, formatNumber, formatDateTime } from '../../utils/formatters';

const TIMELINE_ICONS = { trip: FiMap, maintenance: FiTool, fuel: FiDroplet };
const TIMELINE_LABEL = {
  trip: (d) => `Trip ${d.tripCode}: ${d.source} → ${d.destination}`,
  maintenance: (d) => `Maintenance: ${d.issue}`,
  fuel: (d) => `Fuel fill-up: ${d.quantityLtr}L for ${formatCurrency(d.cost)}`,
};

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehicleService
      .getById(id)
      .then((res) => {
        setVehicle(res.data.vehicle);
        setTimeline(res.data.timeline);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!vehicle) return <p>Vehicle not found.</p>;

  const stats = [
    { label: 'Type', value: vehicle.type },
    { label: 'Max Capacity', value: `${formatNumber(vehicle.maxCapacityKg)} kg` },
    { label: 'Odometer', value: `${formatNumber(vehicle.odometer)} km` },
    { label: 'Purchase Cost', value: formatCurrency(vehicle.purchaseCost) },
    { label: 'Fuel Type', value: vehicle.fuelType },
    { label: 'Region', value: vehicle.region || '—' },
  ];

  return (
    <div className="space-y-6">
      <Link to="/vehicles" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent">
        <FiArrowLeft className="h-4 w-4" /> Back to Vehicles
      </Link>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light text-accent-dark dark:bg-accent/10 dark:text-accent">
              <FiTruck className="h-6 w-6" />
            </div>
            <div>
              <p className="data-mono text-xs font-semibold text-muted">{vehicle.registrationNumber}</p>
              <h1 className="font-display text-2xl font-bold">{vehicle.name}</h1>
            </div>
          </div>
          <StatusBadge status={vehicle.status} className="text-sm" />
        </div>

        <div className="route-divider my-6" />

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-xs uppercase tracking-wide text-muted">{s.label}</p>
              <p className="mt-1 font-medium">{s.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-display text-base font-semibold">Vehicle Timeline</h3>
        <p className="text-xs text-muted">Recent trips, maintenance and fuel activity</p>

        <div className="mt-6 space-y-5">
          {timeline.length === 0 && <p className="text-sm text-muted">No activity recorded yet.</p>}
          {timeline.map((item, i) => {
            const Icon = TIMELINE_ICONS[item.type];
            return (
              <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
                {i !== timeline.length - 1 && <span className="absolute left-[15px] top-8 h-full w-px bg-line dark:bg-white/10" />}
                <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{TIMELINE_LABEL[item.type](item.data)}</p>
                  <p className="text-xs text-muted">{formatDateTime(item.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default VehicleDetailsPage;
