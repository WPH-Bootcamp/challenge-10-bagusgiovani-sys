'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '../authSlice';
import { getEmailError, getPasswordError } from '@/utils/validation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error: serverError } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleEmailBlur = () => {
    setTouched((t) => ({ ...t, email: true }));
    setEmailError(getEmailError(email));
  };

  const handlePasswordBlur = () => {
    setTouched((t) => ({ ...t, password: true }));
    setPasswordError(getPasswordError(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const emailErr = getEmailError(email);
    const passwordErr = getPasswordError(password);
    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) return;

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      router.push('/');
    }
  };

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">
        Sign In
      </h1>

      {serverError && <ErrorMessage message={serverError} className="mb-4" />}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
          onBlur={handleEmailBlur}
          error={touched.email ? emailError : null}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          onBlur={handlePasswordBlur}
          error={touched.password ? passwordError : null}
          showPasswordToggle
          onTogglePassword={() => setShowPassword((v) => !v)}
          showPassword={showPassword}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          className="mt-2"
        >
          Login
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-[var(--primary)] font-medium hover:text-[var(--primary-hover)] transition-colors"
          >
            Register
          </Link>
        </p>
      </form>
    </Card>
  );
}
