import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { FiArrowLeft } from 'react-icons/fi';

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center dark:bg-ink dark:text-white">
    <svg width="80" height="40" viewBox="0 0 80 40" className="mb-6 text-accent">
      <path d="M4 34 L24 14 L34 24 L58 4" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="6 6" />
      <circle cx="58" cy="4" r="4" fill="currentColor" />
    </svg>
    <p className="font-display text-6xl font-bold">404</p>
    <p className="mt-2 font-display text-xl font-semibold">Route not found</p>
    <p className="mt-2 max-w-sm text-sm text-muted">The page you're looking for has been rerouted or doesn't exist.</p>
    <Link to="/dashboard" className="mt-6">
      <Button icon={FiArrowLeft}>Back to Dashboard</Button>
    </Link>
  </div>
);

export default NotFoundPage;
