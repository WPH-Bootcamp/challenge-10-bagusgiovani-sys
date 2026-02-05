// features/auth/components/LoginForm.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setLoginEmail,
  setLoginPassword,
  toggleLoginPasswordVisibility,
  setLoginFieldTouched,
  setLoginEmailError,
  setLoginPasswordError,
  loginUser,
} from '../authSlice';
import { getEmailError, getPasswordError } from '@/utils/validation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Get client state from Redux
  const { 
    email, 
    password, 
    emailError, 
    passwordError, 
    showPassword,
    touched 
  } = useAppSelector((state) => state.auth.loginForm);
  
  // Get server state from Redux (YOUR EXISTING STATE)
  const { isLoading, error: serverError } = useAppSelector((state) => state.auth);

  // Handlers
  const handleEmailChange = (value: string) => {
    dispatch(setLoginEmail(value));
  };

  const handlePasswordChange = (value: string) => {
    dispatch(setLoginPassword(value));
  };

  const handleEmailBlur = () => {
    dispatch(setLoginFieldTouched('email'));
    const error = getEmailError(email);
    dispatch(setLoginEmailError(error));
  };

  const handlePasswordBlur = () => {
    dispatch(setLoginFieldTouched('password'));
    const error = getPasswordError(password);
    dispatch(setLoginPasswordError(error));
  };

  const handleTogglePassword = () => {
    dispatch(toggleLoginPasswordVisibility());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    dispatch(setLoginFieldTouched('email'));
    dispatch(setLoginFieldTouched('password'));

    // Validate all fields using YOUR validation utils
    const emailValidationError = getEmailError(email);
    const passwordValidationError = getPasswordError(password);

    dispatch(setLoginEmailError(emailValidationError));
    dispatch(setLoginPasswordError(passwordValidationError));

    // If there are validation errors, don't submit
    if (emailValidationError || passwordValidationError) {
      return;
    }

    // Call YOUR EXISTING loginUser thunk
    const result = await dispatch(loginUser({ email, password }));
    
    // If login successful, redirect
    if (loginUser.fulfilled.match(result)) {
      router.push('/');
    }
  };

  return (
    <Card>
      {/* Title */}
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">
        Sign In
      </h1>

      {/* Server Error (from API) */}
      {serverError && (
        <ErrorMessage message={serverError} className="mb-4" />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Email Input */}
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          error={touched.email ? emailError : null}
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={handlePasswordBlur}
          error={touched.password ? passwordError : null}
          showPasswordToggle
          onTogglePassword={handleTogglePassword}
          showPassword={showPassword}
        />

        {/* Submit Button */}
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

        {/* Register Link */}
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