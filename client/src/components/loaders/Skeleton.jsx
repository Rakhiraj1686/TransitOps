import React from 'react';
import clsx from 'clsx';

export const Skeleton = ({ className }) => (
  <div className={clsx('animate-pulse rounded-lg bg-black/5 dark:bg-white/10', className)} />
);

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-line bg-white p-5 dark:bg-ink-light dark:border-white/10">
    <Skeleton className="mb-3 h-4 w-24" />
    <Skeleton className="mb-2 h-8 w-16" />
    <Skeleton className="h-3 w-32" />
  </div>
);

export const TableSkeleton = ({ rows = 6, cols = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4">
        {Array.from({ length: cols }).map((__, c) => (
          <Skeleton key={c} className="h-6 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const PageLoader = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <svg width="48" height="24" viewBox="0 0 48 24" className="text-accent">
        <path d="M2 20 L14 8 L20 14 L34 2" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="4 4" className="animate-route-dash" />
        <circle cx="34" cy="2" r="2.5" fill="currentColor" />
      </svg>
      <p className="text-xs font-medium text-muted">Loading…</p>
    </div>
  </div>
);
