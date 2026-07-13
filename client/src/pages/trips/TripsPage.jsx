import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiMap, FiSend, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card, Select } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableToolbar, TablePagination, EmptyState } from '../../components/tables/TableToolbar';
import { TableSkeleton } from '../../components/loaders/Skeleton';
import ConfirmDialog from '../../components/modals/ConfirmDialog';
import TripFormModal from './TripFormModal';
import CompleteTripModal from './CompleteTripModal';
import { tripService } from '../../services/tripService';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatNumber } from '../../utils/formatters';

const STATUS_OPTIONS = ['', 'Draft', 'Dispatched', 'Completed', 'Cancelled'];

const TripsPage = () => {
  const { user } = useAuth();
  const canDispatch = ['Admin', 'Fleet Manager', 'Driver'].includes(user?.role);
  const canCancel = ['Admin', 'Fleet Manager'].includes(user?.role);

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const debouncedSearch = useDebounce(search);

  const fetchTrips = useCallback(() => {
    setLoading(true);
    tripService
      .getAll({ search: debouncedSearch, status, page, limit: 10, sort: '-createdAt' })
      .then((res) => {
        setTrips(res.data);
        setMeta({ pages: res.pages, total: res.total });
      })
      .catch(() => toast.error('Failed to load trips'))
      .finally(() => setLoading(false));
  }, [debouncedSearch, status, page]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => setPage(1), [debouncedSearch, status]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await tripService.create(data);
      toast.success('Trip created as Draft');
      setFormOpen(false);
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setSaving(false);
    }
  };

  const handleDispatch = async (trip) => {
    setActionLoading(true);
    try {
      await tripService.dispatch(trip._id);
      toast.success(`Trip ${trip.tripCode} dispatched`);
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot dispatch this trip');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (data) => {
    setActionLoading(true);
    try {
      await tripService.complete(completeTarget._id, data);
      toast.success(`Trip ${completeTarget.tripCode} completed`);
      setCompleteTarget(null);
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete trip');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await tripService.cancel(cancelTarget._id, { cancelReason: 'Cancelled by operations' });
      toast.success(`Trip ${cancelTarget.tripCode} cancelled`);
      setCancelTarget(null);
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel trip');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Dispatch</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Trips</h1>
          <p className="mt-1 text-sm text-muted">{meta.total} trips · Draft → Dispatched → Completed</p>
        </div>
        <Button icon={FiPlus} onClick={() => setFormOpen(true)}>
          New Trip
        </Button>
      </div>

      <Card className="overflow-hidden">
        <TableToolbar search={search} onSearchChange={setSearch} placeholder="Search by trip code, source, destination…">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s || 'All statuses'}
              </option>
            ))}
          </Select>
        </TableToolbar>

        {loading ? (
          <div className="p-5">
            <TableSkeleton rows={6} cols={7} />
          </div>
        ) : trips.length === 0 ? (
          <EmptyState
            icon={FiMap}
            title="No trips found"
            message="Try adjusting your filters or create a new trip."
            action={
              <Button size="sm" icon={FiPlus} onClick={() => setFormOpen(true)}>
                New Trip
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted dark:border-white/10">
                  <th className="px-5 py-3 font-medium">Trip</th>
                  <th className="px-5 py-3 font-medium">Route</th>
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Driver</th>
                  <th className="px-5 py-3 font-medium">Cargo</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t._id} className="border-b border-line last:border-0 dark:border-white/5">
                    <td className="px-5 py-3.5 data-mono text-xs font-semibold">{t.tripCode}</td>
                    <td className="px-5 py-3.5">
                      {t.source} <span className="text-muted">→</span> {t.destination}
                    </td>
                    <td className="px-5 py-3.5">{t.vehicle?.registrationNumber || '—'}</td>
                    <td className="px-5 py-3.5">{t.driver?.name || '—'}</td>
                    <td className="px-5 py-3.5">{formatNumber(t.cargoWeightKg)} kg</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-5 py-3.5 text-muted">{formatDate(t.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status === 'Draft' && canDispatch && (
                          <Button size="sm" variant="primary" icon={FiSend} onClick={() => handleDispatch(t)} loading={actionLoading}>
                            Dispatch
                          </Button>
                        )}
                        {t.status === 'Dispatched' && canDispatch && (
                          <Button size="sm" variant="success" icon={FiCheckCircle} onClick={() => setCompleteTarget(t)}>
                            Complete
                          </Button>
                        )}
                        {['Draft', 'Dispatched'].includes(t.status) && canCancel && (
                          <button
                            onClick={() => setCancelTarget(t)}
                            className="focus-ring rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                            title="Cancel trip"
                          >
                            <FiXCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <TablePagination page={page} pages={meta.pages} total={meta.total} onPageChange={setPage} />
      </Card>

      <TripFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleCreate} loading={saving} />

      <CompleteTripModal open={!!completeTarget} onClose={() => setCompleteTarget(null)} onSubmit={handleComplete} loading={actionLoading} />

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={actionLoading}
        title="Cancel trip"
        message={`Cancel trip ${cancelTarget?.tripCode}? If dispatched, the vehicle and driver will be restored to Available.`}
        confirmLabel="Cancel Trip"
      />
    </div>
  );
};

export default TripsPage;
