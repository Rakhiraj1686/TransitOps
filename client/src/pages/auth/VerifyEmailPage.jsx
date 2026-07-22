import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Field, Input } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    authService
      .verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.message || 'Email verified successfully.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'This verification link is invalid or has expired.');
      });
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResending(true);
    try {
      const res = await authService.resendVerification(resendEmail);
      toast.success(res.message || 'If an unverified account exists, a new link has been sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="animate-fade-in text-center">
      {status === 'verifying' && (
        <>
          <FiLoader className="mx-auto h-10 w-10 animate-spin text-accent" />
          <h1 className="mt-4 font-display text-2xl font-bold">Verifying your email…</h1>
          <p className="mt-1.5 text-sm text-muted">Hang tight, this only takes a moment.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <FiCheckCircle className="mx-auto h-10 w-10 text-emerald-600" />
          <h1 className="mt-4 font-display text-2xl font-bold">Email verified</h1>
          <p className="mt-1.5 text-sm text-muted">{message}</p>
          <Link
            to="/login"
            className="focus-ring mt-6 inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-accent-dark"
          >
            Go to sign in
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <FiXCircle className="mx-auto h-10 w-10 text-red-600" />
          <h1 className="mt-4 font-display text-2xl font-bold">Verification failed</h1>
          <p className="mt-1.5 text-sm text-muted">{message}</p>

          <form onSubmit={handleResend} className="mt-6 space-y-4 text-left">
            <Field label="Email address">
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  className="pl-10"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                />
              </div>
            </Field>
            <Button type="submit" className="w-full" loading={resending}>
              Resend verification link
            </Button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        Already verified?{' '}
        <Link to="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default VerifyEmailPage;
