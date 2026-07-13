import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Field, Input, Select } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const ROLES = ['Admin', 'Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'];

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'Fleet Manager' } });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted">Set up access to the TransitOps operations console.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Field label="Full name" required error={errors.name?.message}>
          <div className="relative">
            <FiUser className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input placeholder="Jordan Blake" className="pl-10" error={errors.name} {...register('name', { required: 'Name is required' })} />
          </div>
        </Field>

        <Field label="Email address" required error={errors.email?.message}>
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input type="email" placeholder="you@company.com" className="pl-10" error={errors.email} {...register('email', { required: 'Email is required' })} />
          </div>
        </Field>

        <Field label="Role" required>
          <Select {...register('role')}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Password" required error={errors.password?.message} hint="At least 6 characters">
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10"
              error={errors.password}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
          </div>
        </Field>

        <Button type="submit" className="w-full" loading={loading} icon={FiArrowRight}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
