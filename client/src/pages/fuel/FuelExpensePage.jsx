import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiDroplet, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Card } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import { TablePagination, EmptyState } from '../../components/tables/TableToolbar';
import { TableSkeleton } from '../../components/loaders/Skeleton';
import FuelFormModal from './FuelFormModal';
import ExpenseFormModal from './ExpenseFormModal';
import { fuelService, expenseService } from '../../services/fuelService';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';

const FuelExpensePage = () => {
  const [tab, setTab] = useState('fuel');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const service = tab === 'fuel' ? fuelService : expenseService;

  const fetchItems = useCallback(() => {
    setLoading(true);
    service
      .getAll({ page, limit: 10, sort: '-date' })
      .then((res) => {
        setItems(res.data);
        setMeta({ pages: res.pages, total: res.total });
      })
      .catch(() => toast.error('Failed to load records'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => setPage(1), [tab]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await service.create(data);
      toast.success(tab === 'fuel' ? 'Fuel log recorded' : 'Expense recorded');
      setFormOpen(false);
      fetchItems();
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
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Cost tracking</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Fuel &amp; Expenses</h1>
          <p className="mt-1 text-sm text-muted">Track fuel consumption and operational spend</p>
        </div>
        <Button icon={FiPlus} onClick={() => setFormOpen(true)}>
          {tab === 'fuel' ? 'Record Fuel Log' : 'Record Expense'}
        </Button>
      </div>

      <div className="inline-flex rounded-xl border border-line p-1 dark:border-white/10">
        {[
          { key: 'fuel', label: 'Fuel Logs', icon: FiDroplet },
          { key: 'expense', label: 'Expenses', icon: FiCreditCard },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              tab === key ? 'bg-accent text-white shadow-soft' : 'text-muted hover:bg-black/5 dark:hover:bg-white/10'
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-5">
            <TableSkeleton rows={6} cols={5} />
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={tab === 'fuel' ? FiDroplet : FiCreditCard} title="No records found" message="Add your first entry to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted dark:border-white/10">
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  {tab === 'fuel' ? (
                    <>
                      <th className="px-5 py-3 font-medium">Quantity</th>
                      <th className="px-5 py-3 font-medium">Cost</th>
                      <th className="px-5 py-3 font-medium">Station</th>
                    </>
                  ) : (
                    <>
                      <th className="px-5 py-3 font-medium">Category</th>
                      <th className="px-5 py-3 font-medium">Description</th>
                      <th className="px-5 py-3 font-medium">Amount</th>
                    </>
                  )}
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b border-line last:border-0 dark:border-white/5">
                    <td className="px-5 py-3.5 data-mono text-xs font-semibold">{item.vehicle?.registrationNumber || '—'}</td>
                    {tab === 'fuel' ? (
                      <>
                        <td className="px-5 py-3.5">{formatNumber(item.quantityLtr)} L</td>
                        <td className="px-5 py-3.5">{formatCurrency(item.cost)}</td>
                        <td className="px-5 py-3.5">{item.station || '—'}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-3.5">{item.category}</td>
                        <td className="px-5 py-3.5">{item.description}</td>
                        <td className="px-5 py-3.5">{formatCurrency(item.amount)}</td>
                      </>
                    )}
                    <td className="px-5 py-3.5 text-muted">{formatDate(item.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <TablePagination page={page} pages={meta.pages} total={meta.total} onPageChange={setPage} />
      </Card>

      {tab === 'fuel' ? (
        <FuelFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} loading={saving} />
      ) : (
        <ExpenseFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} loading={saving} />
      )}
    </div>
  );
};

export default FuelExpensePage;
