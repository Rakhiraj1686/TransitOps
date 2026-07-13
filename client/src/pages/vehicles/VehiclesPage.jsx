import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiTruck, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card, Select } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableToolbar, TablePagination, EmptyState } from '../../components/tables/TableToolbar';
import { TableSkeleton } from '../../components/loaders/Skeleton';
import ConfirmDialog from '../../components/modals/ConfirmDialog';
import VehicleFormModal from './VehicleFormModal';
import { vehicleService } from '../../services/vehicleService';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { formatNumber, formatCurrency } from '../../utils/formatters';

const STATUS_OPTIONS = ['', 'Available', 'On Trip', 'In Shop', 'Retired'];
const TYPE_OPTIONS = ['', 'Truck', 'Van', 'Mini Truck', 'Trailer', 'Bus', 'Pickup', 'Container Truck'];

const VehiclesPage = () => {
  const { user } = useAuth();
  const canManage = ['Admin', 'Fleet Manager'].includes(user?.role);

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search);

  const fetchVehicles = useCallback(() => {
    setLoading(true);
    vehicleService
      .getAll({ search: debouncedSearch, status, type, page, limit: 10, sort: '-createdAt' })
      .then((res) => {
        setVehicles(res.data);
        setMeta({ pages: res.pages, total: res.total });
      })
      .catch(() => toast.error('Failed to load vehicles'))
      .finally(() => setLoading(false));
  }, [debouncedSearch, status, type, page]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => setPage(1), [debouncedSearch, status, type]);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (vehicle) => {
    setEditing(vehicle);
    setFormOpen(true);
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await vehicleService.update(editing._id, data);
        toast.success('Vehicle updated successfully');
      } else {
        await vehicleService.create(data);
        toast.success('Vehicle registered successfully');
      }
      setFormOpen(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await vehicleService.remove(deleteTarget._id);
      toast.success('Vehicle removed');
      setDeleteTarget(null);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove vehicle');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Fleet</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Vehicles</h1>
          <p className="mt-1 text-sm text-muted">{meta.total} vehicles registered across your fleet</p>
        </div>
        {canManage && (
          <Button icon={FiPlus} onClick={handleCreate}>
            Register Vehicle
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <TableToolbar search={search} onSearchChange={setSearch} placeholder="Search by registration or name…">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s || 'All statuses'}
              </option>
            ))}
          </Select>
          <Select value={type} onChange={(e) => setType(e.target.value)} className="w-auto">
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t || 'All types'}
              </option>
            ))}
          </Select>
        </TableToolbar>

        {loading ? (
          <div className="p-5">
            <TableSkeleton rows={6} cols={6} />
          </div>
        ) : vehicles.length === 0 ? (
          <EmptyState
            icon={FiTruck}
            title="No vehicles found"
            message="Try adjusting your filters or register a new vehicle."
            action={
              canManage && (
                <Button size="sm" icon={FiPlus} onClick={handleCreate}>
                  Register Vehicle
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted dark:border-white/10">
                  <th className="px-5 py-3 font-medium">Registration</th>
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Capacity</th>
                  <th className="px-5 py-3 font-medium">Odometer</th>
                  <th className="px-5 py-3 font-medium">Cost</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v._id} className="border-b border-line last:border-0 dark:border-white/5">
                    <td className="px-5 py-3.5 data-mono text-xs font-semibold">{v.registrationNumber}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{v.name}</p>
                      <p className="text-xs text-muted">{v.manufacturer} {v.year || ''}</p>
                    </td>
                    <td className="px-5 py-3.5">{v.type}</td>
                    <td className="px-5 py-3.5">{formatNumber(v.maxCapacityKg)} kg</td>
                    <td className="px-5 py-3.5">{formatNumber(v.odometer)} km</td>
                    <td className="px-5 py-3.5">{formatCurrency(v.purchaseCost)}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/vehicles/${v._id}`} className="focus-ring rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10">
                          <FiEye className="h-4 w-4" />
                        </Link>
                        {canManage && (
                          <>
                            <button onClick={() => handleEdit(v)} className="focus-ring rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10">
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(v)}
                              className="focus-ring rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </>
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

      <VehicleFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialData={editing} loading={saving} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove vehicle"
        message={`Are you sure you want to remove ${deleteTarget?.registrationNumber}? This action cannot be undone.`}
        confirmLabel="Remove"
      />
    </div>
  );
};

export default VehiclesPage;
