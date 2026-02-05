// features/auth/components/RegisterForm.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setRegisterName,
  setRegisterEmail,
  setRegisterPassword,
  setRegisterConfirmPassword,
  toggleRegisterPasswordVisibility,
  toggleRegisterConfirmPasswordVisibility,
  setRegisterFieldTouched,
  setRegisterNameError,
  setRegisterEmailError,
  setRegisterPasswordError,
  setRegisterConfirmPasswordError,
  registerUser,
} from '../authSlice';
import { 
  getNameError, 
  getEmailError, 
  getPasswordError, 
  getConfirmPasswordError 
} from '@/utils/validation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Get client state from Redux
  const {
    name,
    email,
    password,
    confirmPassword,
    nameError,
    emailError,
    passwordError,
    confirmPasswordError,
    showPassword,
    showConfirmPassword,
    touched,
  } = useAppSelector((state) => state.auth.registerForm);
  
  // Get server state from Redux (YOUR EXISTING STATE)
  const { isLoading, error: serverError } = useAppSelector((state) => state.auth);

  // Handlers
  const handleNameChange = (value: string) => {
    dispatch(setRegisterName(value));
  };

  const handleEmailChange = (value: string) => {
    dispatch(setRegisterEmail(value));
  };

  const handlePasswordChange = (value: string) => {
    dispatch(setRegisterPassword(value));
    // Re-validate confirm password if it's already filled
    if (confirmPassword) {
      const error = getConfirmPasswordError(value, confirmPassword);
      dispatch(setRegisterConfirmPasswordError(error));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    dispatch(setRegisterConfirmPassword(value));
  };

  const handleNameBlur = () => {
    dispatch(setRegisterFieldTouched('name'));
    const error = getNameError(name);
    dispatch(setRegisterNameError(error));
  };

  const handleEmailBlur = () => {
    dispatch(setRegisterFieldTouched('email'));
    const error = getEmailError(email);
    dispatch(setRegisterEmailError(error));
  };

  const handlePasswordBlur = () => {
    dispatch(setRegisterFieldTouched('password'));
    const error = getPasswordError(password);
    dispatch(setRegisterPasswordError(error));
  };

  const handleConfirmPasswordBlur = () => {
    dispatch(setRegisterFieldTouched('confirmPassword'));
    const error = getConfirmPasswordError(password, confirmPassword);
    dispatch(setRegisterConfirmPasswordError(error));
  };

  const handleTogglePassword = () => {
    dispatch(toggleRegisterPasswordVisibility());
  };

  const handleToggleConfirmPassword = () => {
    dispatch(toggleRegisterConfirmPasswordVisibility());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    dispatch(setRegisterFieldTouched('name'));
    dispatch(setRegisterFieldTouched('email'));
    dispatch(setRegisterFieldTouched('password'));
    dispatch(setRegisterFieldTouched('confirmPassword'));

    // Validate all fields using YOUR validation utils
    const nameValidationError = getNameError(name);
    const emailValidationError = getEmailError(email);
    const passwordValidationError = getPasswordError(password);
    const confirmPasswordValidationError = getConfirmPasswordError(password, confirmPassword);

    dispatch(setRegisterNameError(nameValidationError));
    dispatch(setRegisterEmailError(emailValidationError));
    dispatch(setRegisterPasswordError(passwordValidationError));
    dispatch(setRegisterConfirmPasswordError(confirmPasswordValidationError));

    // If there are validation errors, don't submit
    if (
      nameValidationError ||
      emailValidationError ||
      passwordValidationError ||
      confirmPasswordValidationError
    ) {
      return;
    }

    // Call YOUR EXISTING registerUser thunk
    const result = await dispatch(registerUser({ name, email, password }));
    
    // If registration successful, redirect to login
    if (registerUser.fulfilled.match(result)) {
      router.push('/login');
    }
  };

  return (
    <Card>
      {/* Title */}
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">
        Sign Up
      </h1>

      {/* Server Error (from API) */}
      {serverError && (
        <ErrorMessage message={serverError} className="mb-4" />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Name Input */}
        <Input
          label="Name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          error={touched.name ? nameError : null}
        />

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

        {/* Confirm Password Input */}
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Enter your confirm password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onBlur={handleConfirmPasswordBlur}
          error={touched.confirmPassword ? confirmPasswordError : null}
          showPasswordToggle
          onTogglePassword={handleToggleConfirmPassword}
          showPassword={showConfirmPassword}
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
          Register
        </Button>

        {/* Login Link */}
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