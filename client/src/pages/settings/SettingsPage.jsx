import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon, FiUsers, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card, Select } from '../../components/ui/Primitives';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmDialog from '../../components/modals/ConfirmDialog';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { TableSkeleton } from '../../components/loaders/Skeleton';

const ROLES = ['Admin', 'Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'];

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const canManageUsers = ['Admin', 'Fleet Manager'].includes(user?.role);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(canManageUsers);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (canManageUsers) {
      api
        .get('/users', { params: { limit: 50 } })
        .then((res) => setUsers(res.data.data))
        .finally(() => setLoading(false));
    }
  }, [canManageUsers]);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleStatusToggle = async (u) => {
    const nextActive = !u.isActive;
    try {
      await api.put(`/users/${u._id}`, { isActive: nextActive });
      setUsers((prev) => prev.map((usr) => (usr._id === u._id ? { ...usr, isActive: nextActive } : usr)));
      toast.success(nextActive ? 'User marked as available' : 'User suspended');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteUser = async () => {
    setDeleting(true);
    try {
      await api.delete(`/users/${deleteTarget._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      toast.success('User removed');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove user');
    } finally {
      setDeleting(false);
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

      {canManageUsers && (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line p-5 dark:border-white/10">
            <FiUsers className="h-4 w-4 text-accent" />
            <h3 className="font-display text-base font-semibold">User &amp; Role Management</h3>
          </div>
          {loading ? (
            <div className="p-5">
              <TableSkeleton rows={5} cols={5} />
            </div>
          ) : (
            <>
              {/* Mobile / tablet: stacked cards */}
              <div className="divide-y divide-line md:hidden dark:divide-white/5">
                {users.map((u) => (
                  <div key={u._id} className="space-y-2.5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{u.name}</p>
                      <button
                        onClick={() => handleStatusToggle(u)}
                        className="focus-ring rounded-full"
                        aria-label={`Mark ${u.name} as ${u.isActive ? 'suspended' : 'available'}`}
                      >
                        <StatusBadge status={u.isActive ? 'Available' : 'Suspended'} />
                      </button>
                    </div>
                    <p className="text-xs text-muted">{u.email}</p>
                    <div className="flex items-center gap-2">
                      {isAdmin ? (
                        <Select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="w-full">
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <span className="flex-1 text-sm text-muted">{u.role}</span>
                      )}
                      {isAdmin && u._id !== user?._id && (
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="focus-ring shrink-0 rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                          aria-label={`Remove ${u.name}`}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
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
                      <th className="px-5 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-line last:border-0 dark:border-white/5">
                        <td className="px-5 py-3.5 font-medium">{u.name}</td>
                        <td className="px-5 py-3.5 text-muted">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleStatusToggle(u)}
                            className="focus-ring rounded-full"
                            aria-label={`Mark ${u.name} as ${u.isActive ? 'suspended' : 'available'}`}
                          >
                            <StatusBadge status={u.isActive ? 'Available' : 'Suspended'} />
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          {isAdmin ? (
                            <Select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="w-auto">
                              {ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </Select>
                          ) : (
                            <span className="text-muted">{u.role}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {isAdmin && u._id !== user?._id && (
                            <button
                              onClick={() => setDeleteTarget(u)}
                              className="focus-ring rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                              aria-label={`Remove ${u.name}`}
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          )}
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

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteUser}
        loading={deleting}
        title="Remove user"
        message={`Are you sure you want to remove ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Remove"
      />
    </div>
  );
};

export default SettingsPage;
