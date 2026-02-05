/**
 * useProfile Hook - Profile operations
 * Place in: src/features/profile/hooks/useProfile.ts
 */

'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchMyProfile,
  fetchPublicProfile,
  fetchUserById,
  updateMyProfile,
  updatePassword,
  clearViewedProfile,
  clearError,
} from '../profileSlice';
import { UpdateProfileDto, ChangePasswordDto, PaginationParams } from '@/types';

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const { myProfile, viewedProfile, isLoading, error } = useAppSelector((state) => state.profile);

  // Get my profile
  const getMyProfile = useCallback(async () => {
    try {
      await dispatch(fetchMyProfile()).unwrap();
    } catch (error) {
      console.error('Failed to fetch my profile:', error);
      throw error;
    }
  }, [dispatch]);

  // Get public profile by username
  const getPublicProfile = useCallback(async (username: string, params?: PaginationParams) => {
    try {
      await dispatch(fetchPublicProfile({ username, params })).unwrap();
    } catch (error) {
      console.error('Failed to fetch public profile:', error);
      throw error;
    }
  }, [dispatch]);

  // Get user by ID
  const getUserById = useCallback(async (id: number) => {
    try {
      await dispatch(fetchUserById(id)).unwrap();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }, [dispatch]);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileDto) => {
    try {
      await dispatch(updateMyProfile(data)).unwrap();
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }, [dispatch]);

  // Change password
  const changePassword = useCallback(async (data: ChangePasswordDto) => {
    try {
      await dispatch(updatePassword(data)).unwrap();
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }, [dispatch]);

  // Clear viewed profile
  const clearViewed = useCallback(() => {
    dispatch(clearViewedProfile());
  }, [dispatch]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    myProfile,
    viewedProfile,
    isLoading,
    error,
    getMyProfile,
    getPublicProfile,
    getUserById,
    updateProfile,
    changePassword,
    clearViewed,
    clearError: resetError,
  };
};