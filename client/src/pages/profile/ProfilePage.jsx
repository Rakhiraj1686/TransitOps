import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Card, Field, Input } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone || '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { name: data.name, phone: data.phone };
      if (data.password) payload.password = data.password;
      const res = await authService.updateProfile(payload);
      updateUser(res.data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-accent">Account</p>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">My Profile</h1>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-xl font-semibold text-white">{initials}</span>
          <div>
            <p className="font-display text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-muted">{user?.email}</p>
            <p className="mt-1 inline-block rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent-dark dark:bg-accent/10 dark:text-accent">
              {user?.role}
            </p>
          </div>
        </div>

        <div className="route-divider my-6" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field label="Full Name">
            <Input {...register('name')} />
          </Field>
          <Field label="Phone Number">
            <Input {...register('phone')} />
          </Field>
          <Field label="Email" hint="Email cannot be changed">
            <Input value={user?.email} disabled className="opacity-60" />
          </Field>
          <Field label="New Password" hint="Leave blank to keep your current password">
            <Input type="password" placeholder="••••••••" {...register('password')} />
          </Field>

          <div className="flex justify-end">
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
