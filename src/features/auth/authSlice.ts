/**
 * Auth Slice - Redux state for authentication
 * Combines SERVER STATE (API, user, token) + CLIENT STATE (UI, forms)
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login, register, logout } from './auth.service';
import { LoginDto, RegisterDto, User } from '@/types';
import { getErrorMessage } from '@/lib/api';

// ============================================
// CLIENT STATE INTERFACES (UI State)
// ============================================

interface LoginFormState {
  email: string;
  password: string;
  emailError: string | null;
  passwordError: string | null;
  showPassword: boolean;
  touched: {
    email: boolean;
    password: boolean;
  };
}

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nameError: string | null;
  emailError: string | null;
  passwordError: string | null;
  confirmPasswordError: string | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
  touched: {
    name: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  };
}

// ============================================
// COMBINED STATE INTERFACE
// ============================================

interface AuthState {
  // SERVER STATE (existing)
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // CLIENT STATE (new - UI only)
  loginForm: LoginFormState;
  registerForm: RegisterFormState;
}

// Initial state
const initialState: AuthState = {
  // SERVER STATE
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  isLoading: false,
  error: null,
  
  // CLIENT STATE
  loginForm: {
    email: '',
    password: '',
    emailError: null,
    passwordError: null,
    showPassword: false,
    touched: {
      email: false,
      password: false,
    },
  },
  registerForm: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nameError: null,
    emailError: null,
    passwordError: null,
    confirmPasswordError: null,
    showPassword: false,
    showConfirmPassword: false,
    touched: {
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
    },
  },
};

// ============================================
// ASYNC THUNKS (SERVER STATE)
// ============================================

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginDto, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterDto, { rejectWithValue }) => {
    try {
      const response = await register(data);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// ============================================
// SLICE
// ============================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ============================================
    // SERVER STATE ACTIONS (existing)
    // ============================================
    logoutUser: (state) => {
      logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // ============================================
    // CLIENT STATE ACTIONS - LOGIN FORM
    // ============================================
    setLoginEmail: (state, action: PayloadAction<string>) => {
      state.loginForm.email = action.payload;
      // Clear error when user types
      if (state.loginForm.emailError) {
        state.loginForm.emailError = null;
      }
    },
    setLoginPassword: (state, action: PayloadAction<string>) => {
      state.loginForm.password = action.payload;
      // Clear error when user types
      if (state.loginForm.passwordError) {
        state.loginForm.passwordError = null;
      }
    },
    toggleLoginPasswordVisibility: (state) => {
      state.loginForm.showPassword = !state.loginForm.showPassword;
    },
    setLoginFieldTouched: (state, action: PayloadAction<'email' | 'password'>) => {
      state.loginForm.touched[action.payload] = true;
    },
    setLoginEmailError: (state, action: PayloadAction<string | null>) => {
      state.loginForm.emailError = action.payload;
    },
    setLoginPasswordError: (state, action: PayloadAction<string | null>) => {
      state.loginForm.passwordError = action.payload;
    },
    resetLoginForm: (state) => {
      state.loginForm = initialState.loginForm;
    },

    // ============================================
    // CLIENT STATE ACTIONS - REGISTER FORM
    // ============================================
    setRegisterName: (state, action: PayloadAction<string>) => {
      state.registerForm.name = action.payload;
      if (state.registerForm.nameError) {
        state.registerForm.nameError = null;
      }
    },
    setRegisterEmail: (state, action: PayloadAction<string>) => {
      state.registerForm.email = action.payload;
      if (state.registerForm.emailError) {
        state.registerForm.emailError = null;
      }
    },
    setRegisterPassword: (state, action: PayloadAction<string>) => {
      state.registerForm.password = action.payload;
      if (state.registerForm.passwordError) {
        state.registerForm.passwordError = null;
      }
    },
    setRegisterConfirmPassword: (state, action: PayloadAction<string>) => {
      state.registerForm.confirmPassword = action.payload;
      if (state.registerForm.confirmPasswordError) {
        state.registerForm.confirmPasswordError = null;
      }
    },
    toggleRegisterPasswordVisibility: (state) => {
      state.registerForm.showPassword = !state.registerForm.showPassword;
    },
    toggleRegisterConfirmPasswordVisibility: (state) => {
      state.registerForm.showConfirmPassword = !state.registerForm.showConfirmPassword;
    },
    setRegisterFieldTouched: (
      state,
      action: PayloadAction<'name' | 'email' | 'password' | 'confirmPassword'>
    ) => {
      state.registerForm.touched[action.payload] = true;
    },
    setRegisterNameError: (state, action: PayloadAction<string | null>) => {
      state.registerForm.nameError = action.payload;
    },
    setRegisterEmailError: (state, action: PayloadAction<string | null>) => {
      state.registerForm.emailError = action.payload;
    },
    setRegisterPasswordError: (state, action: PayloadAction<string | null>) => {
      state.registerForm.passwordError = action.payload;
    },
    setRegisterConfirmPasswordError: (state, action: PayloadAction<string | null>) => {
      state.registerForm.confirmPasswordError = action.payload;
    },
    resetRegisterForm: (state) => {
      state.registerForm = initialState.registerForm;
    },
  },
  extraReducers: (builder) => {
    // ============================================
    // LOGIN THUNK HANDLERS (existing)
    // ============================================
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      // Clear login form on success
      state.loginForm = initialState.loginForm;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ============================================
    // REGISTER THUNK HANDLERS (existing)
    // ============================================
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
      // Clear register form on success
      state.registerForm = initialState.registerForm;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

// ============================================
// EXPORTS
// ============================================

export const {
  // Server state actions (existing)
  logoutUser,
  setUser,
  clearError,
  // Client state actions - Login
  setLoginEmail,
  setLoginPassword,
  toggleLoginPasswordVisibility,
  setLoginFieldTouched,
  setLoginEmailError,
  setLoginPasswordError,
  resetLoginForm,
  // Client state actions - Register
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
  resetRegisterForm,
} = authSlice.actions;

export default authSlice.reducer;