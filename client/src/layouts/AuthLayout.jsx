import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const AuthLayout = () => (
  <div className="grid min-h-screen lg:grid-cols-2">
    <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-white lg:flex">
      <div className="absolute inset-0 opacity-[0.07]">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative flex items-center gap-2.5">
        <svg width="34" height="34" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="8" fill="#FF6A3D" />
          <path d="M6 20 L14 12 L18 16 L26 8" stroke="#12181F" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="26" cy="8" r="2.5" fill="#12181F" />
        </svg>
        <span className="font-display text-lg font-bold">TransitOps</span>
      </div>

      <div className="relative max-w-md">
        <p className="font-display text-4xl font-semibold leading-tight">
          Every route,
          <br />
          every vehicle,
          <br />
          <span className="text-accent">one console.</span>
        </p>
        <p className="mt-4 text-sm text-white/60">
          Digitize dispatch, maintenance, fuel and compliance — replace the spreadsheet with a
          single operational source of truth.
        </p>
      </div>

      <div className="relative flex items-center gap-6 text-xs text-white/40">
        <span>Fleet Management</span>
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span>Dispatch Rules Engine</span>
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span>Live Analytics</span>
      </div>
    </div>

    <div className="flex items-center justify-center bg-paper p-6 dark:bg-ink sm:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
    <Toaster position="top-right" />
  </div>
);

export default AuthLayout;
