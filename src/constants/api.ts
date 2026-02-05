/**
 * API Endpoint Constants
 * 
 * Centralized API endpoints for consistency and easy refactoring
 */

export const API_ENDPOINTS = {
  // ============================================
  // AUTHENTICATION
  // ============================================
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },

  // ============================================
  // USERS / PROFILE
  // ============================================
  USERS: {
    ME: '/users/me',
    BY_USERNAME: (username: string) => `/users/by-username/${username}`,
    BY_ID: (id: number) => `/users/${id}`,
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/password',
  },

  // ============================================
  // POSTS
  // ============================================
  POSTS: {
    // List endpoints
    RECOMMENDED: '/posts/recommended',
    MOST_LIKED: '/posts/most-liked',
    MY_POSTS: '/posts/my-posts',
    SEARCH: '/posts/search',
    BY_USERNAME: (username: string) => `/posts/by-username/${username}`,
    BY_USER_ID: (userId: number) => `/posts/by-user/${userId}`,
    
    // Single post endpoints
    BY_ID: (id: number | string) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: (id: number | string) => `/posts/${id}`,
    DELETE: (id: number | string) => `/posts/${id}`,
    
    // Post interactions
    LIKE: (id: number | string) => `/posts/${id}/like`,
    LIKES: (id: number | string) => `/posts/${id}/likes`,
    COMMENTS: (id: number | string) => `/posts/${id}/comments`,
  },

  // ============================================
  // COMMENTS
  // ============================================
  COMMENTS: {
    GET_BY_POST: (postId: number | string) => `/comments/${postId}`,
    CREATE: (postId: number | string) => `/comments/${postId}`,
    DELETE: (commentId: number | string) => `/comments/${commentId}`,
  },

  // ============================================
  // HEALTH CHECK
  // ============================================
  HEALTH: '/health',
} as const;

/**
 * API Base URL
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-blg-production.up.railway.app/api';

/**
 * API Request Headers
 */
export const API_HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
  },
  MULTIPART: {
    'Content-Type': 'multipart/form-data',
  },
} as const;

/**
 * API Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
  MAX_LIMIT: 50,
} as const;