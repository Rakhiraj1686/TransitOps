// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import clsx from 'clsx';
// import {
//   FiGrid,
//   FiTruck,
//   FiUsers,
//   FiMap,
//   FiTool,
//   FiDroplet,
//   FiBarChart2,
//   FiSettings,
//   FiX,
// } from 'react-icons/fi';

// const NAV_ITEMS = [
//   { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
//   { to: '/vehicles', label: 'Vehicles', icon: FiTruck },
//   { to: '/drivers', label: 'Drivers', icon: FiUsers },
//   { to: '/trips', label: 'Trips', icon: FiMap },
//   { to: '/maintenance', label: 'Maintenance', icon: FiTool },
//   { to: '/fuel', label: 'Fuel & Expenses', icon: FiDroplet },
//   { to: '/reports', label: 'Reports', icon: FiBarChart2 },
//   { to: '/settings', label: 'Settings', icon: FiSettings },
// ];

// const Sidebar = ({ open, onClose }) => (
//   <>
//     {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
//     <aside
//       className={clsx(
//         'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink text-white transition-transform duration-200 lg:static lg:translate-x-0',
//         open ? 'translate-x-0' : '-translate-x-full'
//       )}
//     >
//       <div className="flex items-center justify-between px-5 py-5">
//         <div className="flex items-center gap-2.5">
//           <svg width="30" height="30" viewBox="0 0 32 32" className="shrink-0">
//             <rect width="32" height="32" rx="8" fill="#FF6A3D" />
//             <path d="M6 20 L14 12 L18 16 L26 8" stroke="#12181F" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
//             <circle cx="26" cy="8" r="2.5" fill="#12181F" />
//           </svg>
//           <div>
//             <p className="font-display text-sm font-bold leading-none">TransitOps</p>
//             <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">Fleet Command</p>
//           </div>
//         </div>
//         <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/10 lg:hidden">
//           <FiX className="h-5 w-5" />
//         </button>
//       </div>

//       <div className="route-divider mx-5" />

//       <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
//         {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
//           <NavLink
//             key={to}
//             to={to}
//             onClick={onClose}
//             className={({ isActive }) =>
//               clsx(
//                 'focus-ring flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
//                 isActive ? 'bg-accent text-white shadow-glow' : 'text-white/70 hover:bg-white/5 hover:text-white'
//               )
//             }
//           >
//             <Icon className="h-[18px] w-[18px] shrink-0" />
//             {label}
//           </NavLink>
//         ))}
//       </nav>

//       <div className="mx-5 mb-5 rounded-xl bg-white/5 p-4">
//         <p className="text-xs font-medium text-white/60">Fleet uptime</p>
//         <p className="font-display mt-1 text-lg font-semibold text-accent">98.4%</p>
//         <p className="mt-1 text-[11px] text-white/40">Across all active regions</p>
//       </div>
//     </aside>
//   </>
// );

// export default Sidebar;


import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  FiGrid,
  FiTruck,
  FiUsers,
  FiMap,
  FiTool,
  FiDroplet,
  FiBarChart2,
  FiSettings,
  FiX,
} from 'react-icons/fi';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/vehicles', label: 'Vehicles', icon: FiTruck },
  { to: '/drivers', label: 'Drivers', icon: FiUsers },
  { to: '/trips', label: 'Trips', icon: FiMap },
  { to: '/maintenance', label: 'Maintenance', icon: FiTool },
  { to: '/fuel', label: 'Fuel & Expenses', icon: FiDroplet },
  { to: '/reports', label: 'Reports', icon: FiBarChart2 },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

const Sidebar = ({ open, onClose }) => (
  <>
    {open && (
      <div
        className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        onClick={onClose}
      />
    )}

    <aside
      className={clsx(
        `fixed inset-y-0 left-0 z-40 flex w-64 flex-col
        bg-white dark:bg-ink-light
        border-r border-line dark:border-[#2A3442]
        text-[#1B222C] dark:text-white
        transition-transform duration-200
        lg:static lg:translate-x-0`,
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#FF6A3D" />
            <path
              d="M6 20 L14 12 L18 16 L26 8"
              stroke="#12181F"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="26" cy="8" r="2.5" fill="#12181F" />
          </svg>

          <div>
            <p className="font-display text-sm font-bold">
              TransitOps
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted dark:text-white/40">
              Fleet Command
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 lg:hidden"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <div className="route-divider mx-5" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'focus-ring flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent text-white shadow-glow'
                  : 'text-muted dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#1B222C] dark:hover:text-white'
              )
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Fleet Status */}
      <div className="mx-5 mb-5 rounded-xl border border-line dark:border-[#2A3442] bg-white dark:bg-white/5 p-4 shadow-sm dark:shadow-none">
        <p className="text-xs font-medium text-muted dark:text-white/60">
          Fleet uptime
        </p>

        <p className="mt-1 font-display text-lg font-semibold text-accent">
          98.4%
        </p>

        <p className="mt-1 text-[11px] text-gray-500 dark:text-white/40">
          Across all active regions
        </p>
      </div>
    </aside>
  </>
);

export default Sidebar;