import React from 'react';
import clsx from 'clsx';

const VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-dark shadow-soft',
  secondary: 'bg-ink text-white hover:bg-ink-light dark:bg-white dark:text-ink dark:hover:bg-gray-200',
  outline: 'border border-line bg-transparent text-current hover:bg-black/5 dark:hover:bg-white/5',
  ghost: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-soft',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-soft',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

const Button = React.forwardRef(
  ({ variant = 'primary', size = 'md', className, children, loading, icon: Icon, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        Icon && <Icon className="h-4 w-4 shrink-0" />
      )}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
export default Button;
