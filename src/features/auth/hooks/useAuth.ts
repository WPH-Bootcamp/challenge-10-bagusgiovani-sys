/**
 * useAuth Hook - Authentication logic
 */

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, registerUser, logoutUser, setUser, clearError } from '../authSlice';
import { fetchMyProfile } from '@/features/profile/profileSlice';
import { LoginDto, RegisterDto } from '@/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  // Login
  const login = useCallback(async (credentials: LoginDto) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      
      // Fetch user profile after login
      const profile = await dispatch(fetchMyProfile()).unwrap();
      dispatch(setUser(profile));
      
      router.push('/');
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch, router]);

  // Register
  const register = useCallback(async (data: RegisterDto) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      router.push('/login');
    } catch (error) {
      throw error;
    }
  }, [dispatch, router]);

  // Logout
  const logout = useCallback(() => {
    dispatch(logoutUser());
    router.push('/login');
  }, [dispatch, router]);

  // Load user profile
  const loadUser = useCallback(async () => {
    if (isAuthenticated && !user) {
      try {
        const profile = await dispatch(fetchMyProfile()).unwrap();
        dispatch(setUser(profile));
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    }
  }, [dispatch, isAuthenticated, user]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loadUser,
    clearError: resetError,
  };
};