import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { Input } from '../ui/Primitives';
import Button from '../ui/Button';

export const TableToolbar = ({ search, onSearchChange, placeholder = 'Search…', children }) => (
  <div className="flex flex-col gap-3 border-b border-line p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
    <div className="relative w-full sm:max-w-xs">
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={placeholder} className="pl-9" />
    </div>
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  </div>
);

export const TablePagination = ({ page, pages, total, onPageChange }) => {
  if (!pages || pages <= 1) return total ? (
    <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-muted dark:border-white/10">
      <span>{total} result{total !== 1 ? 's' : ''}</span>
    </div>
  ) : null;

  return (
    <div className="flex items-center justify-between border-t border-line px-4 py-3 dark:border-white/10">
      <span className="text-xs text-muted">
        Page {page} of {pages} · {total} results
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export const EmptyState = ({ title = 'Nothing here yet', message, icon: Icon, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
    {Icon && (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-muted dark:bg-white/10">
        <Icon className="h-5 w-5" />
      </div>
    )}
    <div>
      <p className="font-display font-semibold">{title}</p>
      {message && <p className="mt-1 text-sm text-muted">{message}</p>}
    </div>
    {action}
  </div>
);
