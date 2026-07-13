import React from 'react';
import { motion } from 'framer-motion';
import CountUp from './CountUp';
import clsx from 'clsx';

const KpiCard = ({ label, value, icon: Icon, accent = 'accent', suffix = '', delay = 0, trend }) => {
  const accentClasses = {
    accent: 'bg-accent-light text-accent-dark dark:bg-accent/10 dark:text-accent',
    teal: 'bg-teal-light text-teal-dark dark:bg-teal/10 dark:text-teal',
    ink: 'bg-ink/5 text-ink dark:bg-white/10 dark:text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl border border-line bg-white p-5 shadow-card dark:bg-ink-light dark:border-white/10"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold data-mono">
            <CountUp value={value} />
            {suffix}
          </p>
          {trend !== undefined && (
            <p className={clsx('mt-1 text-xs font-medium', trend >= 0 ? 'text-emerald-600' : 'text-red-600')}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', accentClasses[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default KpiCard;
