'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser } from '../authSlice';
import {
  getNameError,
  getEmailError,
  getPasswordError,
  getConfirmPasswordError,
} from '@/utils/validation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error: serverError } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (confirmPassword) {
      setConfirmPasswordError(getConfirmPasswordError(value, confirmPassword));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    const nameErr = getNameError(name);
    const emailErr = getEmailError(email);
    const passwordErr = getPasswordError(password);
    const confirmErr = getConfirmPasswordError(password, confirmPassword);

    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmErr);

    if (nameErr || emailErr || passwordErr || confirmErr) return;

    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      router.push('/login');
    }
  };

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">
        Sign Up
      </h1>

      {serverError && <ErrorMessage message={serverError} className="mb-4" />}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={setName}
          onBlur={() => { setTouched((t) => ({ ...t, name: true })); setNameError(getNameError(name)); }}
          error={touched.name ? nameError : null}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
          onBlur={() => { setTouched((t) => ({ ...t, email: true })); setEmailError(getEmailError(email)); }}
          error={touched.email ? emailError : null}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => { setTouched((t) => ({ ...t, password: true })); setPasswordError(getPasswordError(password)); }}
          error={touched.password ? passwordError : null}
          showPasswordToggle
          onTogglePassword={() => setShowPassword((v) => !v)}
          showPassword={showPassword}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Enter your confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          onBlur={() => { setTouched((t) => ({ ...t, confirmPassword: true })); setConfirmPasswordError(getConfirmPasswordError(password, confirmPassword)); }}
          error={touched.confirmPassword ? confirmPasswordError : null}
          showPasswordToggle
          onTogglePassword={() => setShowConfirmPassword((v) => !v)}
          showPassword={showConfirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          className="mt-2"
        >
          Register
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[var(--primary)] font-medium hover:text-[var(--primary-hover)] transition-colors"
          >
            Log in
          </Link>
        </p>
      </form>
    </Card>
  );
}
