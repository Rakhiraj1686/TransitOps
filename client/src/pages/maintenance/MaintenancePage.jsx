import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiTool, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card, Select } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableToolbar, TablePagination, EmptyState } from '../../components/tables/TableToolbar';
import { TableSkeleton } from '../../components/loaders/Skeleton';
import MaintenanceFormModal from './MaintenanceFormModal';
import { maintenanceService } from '../../services/maintenanceService';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const STATUS_OPTIONS = ['', 'Pending', 'Approved', 'In Progress', 'Completed'];
const PRIORITY_STYLES = {
  Low: 'text-slate-500',
  Medium: 'text-amber-600',
  High: 'text-orange-600',
  Critical: 'text-red-600',
};

const MaintenancePage = () => {
  const { user } = useAuth();
  const canManage = ['Admin', 'Fleet Manager'].includes(user?.role);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const debouncedSearch = useDebounce(search);

  const fetchRecords = useCallback(() => {
    setLoading(true);
    maintenanceService
      .getAll({ search: debouncedSearch, status, page, limit: 10, sort: '-createdAt' })
      .then((res) => {
        setRecords(res.data);
        setMeta({ pages: res.pages, total: res.total });
      })
      .catch(() => toast.error('Failed to load maintenance records'))
      .finally(() => setLoading(false));
  }, [debouncedSearch, status, page]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => setPage(1), [debouncedSearch, status]);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    setFormOpen(true);
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await maintenanceService.update(editing._id, data);
        toast.success('Maintenance record updated');
      } else {
        await maintenanceService.create(data);
        toast.success('Maintenance logged. Vehicle moved to In Shop.');
      }
      setFormOpen(false);
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Service &amp; repair</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Maintenance</h1>
          <p className="mt-1 text-sm text-muted">{meta.total} maintenance records</p>
        </div>
        {canManage && (
          <Button icon={FiPlus} onClick={handleCreate}>
            Log Maintenance
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <TableToolbar search={search} onSearchChange={setSearch} placeholder="Search by issue or technician…">
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
            <TableSkeleton rows={6} cols={6} />
          </div>
        ) : records.length === 0 ? (
          <EmptyState
            icon={FiTool}
            title="No maintenance records"
            message="Try adjusting your filters or log a new maintenance record."
            action={
              canManage && (
                <Button size="sm" icon={FiPlus} onClick={handleCreate}>
                  Log Maintenance
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted dark:border-white/10">
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Issue</th>
                  <th className="px-5 py-3 font-medium">Technician</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Cost</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Started</th>
                  {canManage && <th className="px-5 py-3 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} className="border-b border-line last:border-0 dark:border-white/5">
                    <td className="px-5 py-3.5 data-mono text-xs font-semibold">{r.vehicle?.registrationNumber || '—'}</td>
                    <td className="px-5 py-3.5">{r.issue}</td>
                    <td className="px-5 py-3.5">{r.technician}</td>
                    <td className={`px-5 py-3.5 font-medium ${PRIORITY_STYLES[r.priority]}`}>{r.priority}</td>
                    <td className="px-5 py-3.5">{formatCurrency(r.cost)}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3.5 text-muted">{formatDate(r.startedAt)}</td>
                    {canManage && (
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => handleEdit(r)} className="focus-ring rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10">
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <TablePagination page={page} pages={meta.pages} total={meta.total} onPageChange={setPage} />
      </Card>

      <MaintenanceFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialData={editing} loading={saving} />
    </div>
  );
};

export default MaintenancePage;
