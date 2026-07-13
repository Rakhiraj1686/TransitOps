import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card, Select } from '../../components/ui/Primitives';
import StatusBadge from '../../components/ui/StatusBadge';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { TableSkeleton } from '../../components/loaders/Skeleton';

const ROLES = ['Admin', 'Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'];

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(isAdmin);

  useEffect(() => {
    if (isAdmin) {
      api
        .get('/users', { params: { limit: 50 } })
        .then((res) => setUsers(res.data.data))
        .finally(() => setLoading(false));
    }
  }, [isAdmin]);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-accent">Preferences</p>
        <h1 className="font-display text-xl font-bold sm:text-2xl lg:text-3xl">Settings</h1>
      </div>

      <Card className="p-6">
        <h3 className="font-display text-base font-semibold">Appearance</h3>
        <p className="mt-1 text-sm text-muted">Switch between light and dark mode for the console.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => theme !== 'light' && toggleTheme()}
            className={`flex flex-1 items-center gap-3 rounded-xl border p-4 text-left transition-colors ${theme === 'light' ? 'border-accent bg-accent-light dark:bg-accent/10' : 'border-line dark:border-white/10'}`}
          >
            <FiSun className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Light</p>
              <p className="text-xs text-muted">Bright workspace</p>
            </div>
          </button>
          <button
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={`flex flex-1 items-center gap-3 rounded-xl border p-4 text-left transition-colors ${theme === 'dark' ? 'border-accent bg-accent-light dark:bg-accent/10' : 'border-line dark:border-white/10'}`}
          >
            <FiMoon className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Dark</p>
              <p className="text-xs text-muted">Ideal for dispatch rooms</p>
            </div>
          </button>
        </div>
      </Card>

      {isAdmin && (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line p-5 dark:border-white/10">
            <FiUsers className="h-4 w-4 text-accent" />
            <h3 className="font-display text-base font-semibold">User &amp; Role Management</h3>
          </div>
          {loading ? (
            <div className="p-5">
              <TableSkeleton rows={5} cols={4} />
            </div>
          ) : (
            <>
              {/* Mobile / tablet: stacked cards */}
              <div className="divide-y divide-line md:hidden dark:divide-white/5">
                {users.map((u) => (
                  <div key={u._id} className="space-y-2.5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{u.name}</p>
                      <StatusBadge status={u.isActive ? 'Available' : 'Suspended'} />
                    </div>
                    <p className="text-xs text-muted">{u.email}</p>
                    <Select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="w-full">
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>

              {/* Desktop: full table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs uppercase tracking-wide text-muted dark:border-white/10">
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Email</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-line last:border-0 dark:border-white/5">
                        <td className="px-5 py-3.5 font-medium">{u.name}</td>
                        <td className="px-5 py-3.5 text-muted">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={u.isActive ? 'Available' : 'Suspended'} />
                        </td>
                        <td className="px-5 py-3.5">
                          <Select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="w-auto">
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;
