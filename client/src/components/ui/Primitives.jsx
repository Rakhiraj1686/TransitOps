import React from 'react';
import clsx from 'clsx';

export const Card = ({ className, children, ...props }) => (
  <div className={clsx('rounded-2xl border border-line bg-white shadow-card dark:bg-ink-light dark:border-white/10', className)} {...props}>
    {children}
  </div>
);

export const Field = ({ label, error, required, children, hint }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-sm font-medium text-current/80">
        {label} {required && <span className="text-accent">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    {error && <p className="text-xs font-medium text-red-600">{error}</p>}
  </div>
);

export const Input = React.forwardRef(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      'focus-ring w-full rounded-xl border bg-transparent px-3.5 py-2.5 text-sm placeholder:text-muted transition-colors',
      error ? 'border-red-400' : 'border-line dark:border-white/10',
      'dark:bg-white/5',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Select = React.forwardRef(({ className, error, children, ...props }, ref) => (
  <select
    ref={ref}
    className={clsx(
      'focus-ring w-full rounded-xl border bg-transparent px-3.5 py-2.5 text-sm transition-colors',
      error ? 'border-red-400' : 'border-line dark:border-white/10',
      'dark:bg-ink-light',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

export const Textarea = React.forwardRef(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={clsx(
      'focus-ring w-full rounded-xl border bg-transparent px-3.5 py-2.5 text-sm placeholder:text-muted transition-colors',
      error ? 'border-red-400' : 'border-line dark:border-white/10',
      'dark:bg-white/5',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
