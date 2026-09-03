import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Field, Input } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@transitops.com' },
  { role: 'Fleet Manager', email: 'fleetmanager@transitops.com' },
  { role: 'Driver', email: 'driver@transitops.com' },
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resending, setResending] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      setUnverifiedEmail(err.response?.status === 403 && message.toLowerCase().includes('verify') ? data.email : '');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setResending(true);
    try {
      const response = await authService.resendVerification(unverifiedEmail);
      toast.success(response.message || 'A new verification link has been sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend the verification link');
    } finally {
      setResending(false);
    }
  };

  const fillDemo = (email) => {
    setValue('email', email);
    setValue('password', 'password123');
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted">Sign in to your TransitOps operations console.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Field label="Email address" required error={errors.email?.message}>
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              type="email"
              placeholder="you@company.com"
              className="pl-10"
              error={errors.email}
              {...register('email', { required: 'Email is required' })}
            />
          </div>
        </Field>

        <Field label="Password" required error={errors.password?.message}>
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10"
              error={errors.password}
              {...register('password', { required: 'Password is required' })}
            />
          </div>
        </Field>

        <Button type="submit" className="w-full" loading={loading} icon={FiArrowRight}>
          Sign in
        </Button>
      </form>

      {unverifiedEmail && (
        <div className="mt-4 rounded-xl border border-line p-4 dark:border-white/10">
          <p className="text-sm text-muted">Your email is not verified yet.</p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3 w-full"
            loading={resending}
            icon={FiRefreshCw}
            onClick={resendVerification}
          >
            Resend verification link
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-accent hover:underline">
          Create one
        </Link>
      </p>

      <div className="mt-8 rounded-xl border border-line p-4 dark:border-white/10">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Quick demo access</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => fillDemo(acc.email)}
              className="focus-ring rounded-lg border border-line px-3 py-1.5 text-xs font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
            >
              {acc.role}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted">Password for all demo accounts: password123</p>
      </div>
    </div>
  );
};

export default LoginPage;
