/**
 * Profile/User Service - All Profile & User-related API calls
 * Based on Swagger API: https://be-blg-production.up.railway.app/api
 */

import api from '@/lib/api';
import {
  User,
  PublicProfile,
  UpdateProfileDto,
  ChangePasswordDto,
  PasswordChangeResponse,
  PaginationParams,
} from '@/types';

// ============================================
// 1. GET MY PROFILE (Requires Auth)
// ============================================
/**
 * GET /users/me
 * Get current logged-in user's profile
 * Requires: JWT token
 * Used for: My profile page, navbar user info
 * Returns: Full user profile with email
 * 
 * @returns Current user's profile data
 */
export const getMyProfile = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data;
};

// ============================================
// 2. GET PUBLIC PROFILE BY USERNAME
// ============================================
/**
 * GET /users/by-username/{username}
 * Get public profile by username + user's posts
 * Used for: Other user's profile page
 * Returns: User info (without email) + paginated posts
 * 
 * @param username - Username of the user
 * @param params - Pagination parameters for posts
 * @returns Public profile with posts
 */
export const getPublicProfileByUsername = async (
  username: string,
  params?: PaginationParams
): Promise<PublicProfile> => {
  const response = await api.get(`/users/by-username/${username}`, {
    params: {
      limit: params?.limit || 10,
      page: params?.page || 1,
    },
  });
  return response.data;
};

// ============================================
// 3. GET USER BY ID
// ============================================
/**
 * GET /users/{id}
 * Get user info by user ID
 * Used for: Looking up user details
 * Returns: User info
 * 
 * @param id - User ID
 * @returns User data
 */
export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// ============================================
// 4. UPDATE PROFILE (Requires Auth)
// ============================================
/**
 * PATCH /users/profile
 * Update user profile (name, headline, avatar)
 * Content-Type: multipart/form-data
 * Requires: JWT token
 * Used for: Edit profile modal
 * 
 * All fields are optional:
 * - name: Display name
 * - headline: Profile headline/title
 * - avatar: Profile picture (JPEG/PNG, max 5MB)
 * 
 * @param data - Profile update data
 * @returns Updated user profile with new avatarUrl
 */
export const updateProfile = async (data: UpdateProfileDto): Promise<User> => {
  const formData = new FormData();
  
  if (data.name) {
    formData.append('name', data.name);
  }
  
  if (data.headline) {
    formData.append('headline', data.headline);
  }
  
  if (data.avatar) {
    formData.append('avatar', data.avatar);
  }

  const response = await api.patch('/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// ============================================
// 5. CHANGE PASSWORD (Requires Auth)
// ============================================
/**
 * PATCH /users/password
 * Update user password
 * Requires: JWT token
 * Used for: Change password form in My Profile page (tab)
 * 
 * @param data - Password change data
 * @returns Success response
 */
export const changePassword = async (
  data: ChangePasswordDto
): Promise<PasswordChangeResponse> => {
  const response = await api.patch('/users/password', data);
  return response.data;
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
export default {
  getMyProfile,
  getPublicProfileByUsername,
  getUserById,
  updateProfile,
  changePassword,
};