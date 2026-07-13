import React from 'react';
import clsx from 'clsx';

const STATUS_STYLES = {
  Available: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400',
  'On Trip': 'bg-accent-light text-accent-dark ring-accent/30 dark:bg-accent/10 dark:text-accent',
  'In Shop': 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400',
  Retired: 'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-500/10 dark:text-gray-400',
  'Off Duty': 'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-500/10 dark:text-gray-400',
  Suspended: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400',
  Draft: 'bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300',
  Dispatched: 'bg-teal-light text-teal-dark ring-teal/30 dark:bg-teal/10 dark:text-teal',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400',
  Cancelled: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400',
  Pending: 'bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300',
  Approved: 'bg-teal-light text-teal-dark ring-teal/30 dark:bg-teal/10 dark:text-teal',
  'In Progress': 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400',
};

const StatusBadge = ({ status, className }) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap',
      STATUS_STYLES[status] || 'bg-gray-100 text-gray-600 ring-gray-500/20',
      className
    )}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {status}
  </span>
);

export default StatusBadge;
