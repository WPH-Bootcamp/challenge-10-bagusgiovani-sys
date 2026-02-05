/**
 * Auth Service - Authentication API calls
 */

import api, { setAuthToken, removeAuthToken } from '@/lib/api';
import { 
  RegisterDto, 
  LoginDto, 
  AuthResponse, 
  RegisterResponse 
} from '@/types';

// ============================================
// 1. REGISTER NEW USER
// ============================================
/**
 * POST /auth/register
 * Register a new user account
 * 
 * @param data - Registration data (name, email, password, optional username)
 * @returns Registered user info (id, email, username)
 */
export const register = async (data: RegisterDto): Promise<RegisterResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// ============================================
// 2. LOGIN USER
// ============================================
/**
 * POST /auth/login
 * Login user and get JWT token
 * 
 * @param data - Login credentials (email, password)
 * @returns JWT token
 */
export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  
  // Save token to localStorage
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  
  return response.data;
};

// ============================================
// 3. LOGOUT USER
// ============================================
/**
 * Logout user (client-side only)
 * Removes token from localStorage
 */
export const logout = (): void => {
  removeAuthToken();
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
export default {
  register,
  login,
  logout,
};