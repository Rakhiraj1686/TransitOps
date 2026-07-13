import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiUsers, FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Card, Select } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableToolbar, TablePagination, EmptyState } from '../../components/tables/TableToolbar';
import { TableSkeleton } from '../../components/loaders/Skeleton';
import ConfirmDialog from '../../components/modals/ConfirmDialog';
import DriverFormModal from './DriverFormModal';
import { driverService } from '../../services/driverService';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { formatDate, daysUntil } from '../../utils/formatters';

const STATUS_OPTIONS = ['', 'Available', 'On Trip', 'Off Duty', 'Suspended'];

const DriversPage = () => {
  const { user } = useAuth();
  const canManage = ['Admin', 'Fleet Manager', 'Safety Officer'].includes(user?.role);

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search);

  const fetchDrivers = useCallback(() => {
    setLoading(true);
    driverService
      .getAll({ search: debouncedSearch, status, page, limit: 10, sort: 'licenseExpiry' })
      .then((res) => {
        setDrivers(res.data);
        setMeta({ pages: res.pages, total: res.total });
      })
      .catch(() => toast.error('Failed to load drivers'))
      .finally(() => setLoading(false));
  }, [debouncedSearch, status, page]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  useEffect(() => setPage(1), [debouncedSearch, status]);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (driver) => {
    setEditing(driver);
    setFormOpen(true);
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await driverService.update(editing._id, data);
        toast.success('Driver updated successfully');
      } else {
        await driverService.create(data);
        toast.success('Driver added successfully');
      }
      setFormOpen(false);
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await driverService.remove(deleteTarget._id);
      toast.success('Driver removed');
      setDeleteTarget(null);
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove driver');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Personnel</p>
          <h1 className="font-display text-xl font-bold sm:text-2xl lg:text-3xl">Drivers</h1>
          <p className="mt-1 text-sm text-muted">{meta.total} drivers on record</p>
        </div>
        {canManage && (
          <Button icon={FiPlus} onClick={handleCreate}>
            Add Driver
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <TableToolbar search={search} onSearchChange={setSearch} placeholder="Search by name, license or phone…">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full sm:w-auto">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s || 'All statuses'}
              </option>
            ))}
          </Select>
        </TableToolbar>

        {loading ? (
          <div className="p-5">
            <TableSkeleton rows={6} cols={6} />
          </div>
        ) : drivers.length === 0 ? (
          <EmptyState
            icon={FiUsers}
            title="No drivers found"
            message="Try adjusting your filters or add a new driver."
            action={
              canManage && (
                <Button size="sm" icon={FiPlus} onClick={handleCreate}>
                  Add Driver
                </Button>
              )
            }
          />
        ) : (
          <>
            {/* Mobile / tablet: stacked cards (avoids cramped horizontal scrolling) */}
            <div className="divide-y divide-line md:hidden dark:divide-white/5">
              {drivers.map((d) => {
                const remaining = daysUntil(d.licenseExpiry);
                const expired = remaining < 0;
                const expiringSoon = remaining >= 0 && remaining <= 30;
                return (
                  <div key={d._id} className={clsx('space-y-2.5 p-4', expired && 'bg-red-50/50 dark:bg-red-500/5')}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{d.name}</p>
                        <p className="data-mono text-xs text-muted">
                          {d.licenseNumber} · {d.licenseCategory}
                        </p>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-muted">Expires {formatDate(d.licenseExpiry)}</span>
                      {(expired || expiringSoon) && (
                        <span
                          className={clsx(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            expired ? 'bg-red-100 text-red-700 dark:bg-red-500/15' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15'
                          )}
                        >
                          <FiAlertTriangle className="h-3 w-3" /> {expired ? 'Expired' : 'Expiring soon'}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted">
                      <span>{d.phone}</span>
                      <span>
                        Safety:{' '}
                        <span className={clsx('font-medium', d.safetyScore < 70 ? 'text-red-600' : 'text-emerald-600')}>{d.safetyScore}</span>
                      </span>
                    </div>

                    {canManage && (
                      <div className="flex items-center justify-end gap-1 border-t border-line pt-2 dark:border-white/10">
                        <button onClick={() => handleEdit(d)} className="focus-ring rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10">
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(d)}
                          className="focus-ring rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop: full table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-muted dark:border-white/10">
                    <th className="px-5 py-3 font-medium">Driver</th>
                    <th className="px-5 py-3 font-medium">License</th>
                    <th className="px-5 py-3 font-medium">Expiry</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Safety Score</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((d) => {
                    const remaining = daysUntil(d.licenseExpiry);
                    const expired = remaining < 0;
                    const expiringSoon = remaining >= 0 && remaining <= 30;
                    return (
                      <tr key={d._id} className={clsx('border-b border-line last:border-0 dark:border-white/5', expired && 'bg-red-50/50 dark:bg-red-500/5')}>
                        <td className="px-5 py-3.5 font-medium">{d.name}</td>
                        <td className="px-5 py-3.5 data-mono text-xs">{d.licenseNumber} · {d.licenseCategory}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {formatDate(d.licenseExpiry)}
                            {(expired || expiringSoon) && (
                              <span className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', expired ? 'bg-red-100 text-red-700 dark:bg-red-500/15' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15')}>
                                <FiAlertTriangle className="h-3 w-3" /> {expired ? 'Expired' : 'Expiring soon'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">{d.phone}</td>
                        <td className="px-5 py-3.5">
                          <span className={clsx('font-medium', d.safetyScore < 70 ? 'text-red-600' : 'text-emerald-600')}>{d.safetyScore}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={d.status} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            {canManage && (
                              <>
                                <button onClick={() => handleEdit(d)} className="focus-ring rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10">
                                  <FiEdit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(d)}
                                  className="focus-ring rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <TablePagination page={page} pages={meta.pages} total={meta.total} onPageChange={setPage} />
      </Card>

      <DriverFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialData={editing} loading={saving} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove driver"
        message={`Are you sure you want to remove ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Remove"
      />
    </div>
  );
};

export default DriversPage;
