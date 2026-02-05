/**
 * Profile Slice - Redux state for user profiles
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getMyProfile, 
  getPublicProfileByUsername, 
  getUserById,
  updateProfile, 
  changePassword 
} from './profile.service';
import { User, PublicProfile, UpdateProfileDto, ChangePasswordDto, PaginationParams } from '@/types';
import { getErrorMessage } from '@/lib/api';

// State interface
interface ProfileState {
  myProfile: User | null;
  viewedProfile: PublicProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProfileState = {
  myProfile: null,
  viewedProfile: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchMyProfile = createAsyncThunk(
  'profile/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      return await getMyProfile();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchPublicProfile = createAsyncThunk(
  'profile/fetchPublic',
  async ({ username, params }: { username: string; params?: PaginationParams }, { rejectWithValue }) => {
    try {
      return await getPublicProfileByUsername(username, params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'profile/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await getUserById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateMyProfile = createAsyncThunk(
  'profile/update',
  async (data: UpdateProfileDto, { rejectWithValue }) => {
    try {
      return await updateProfile(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updatePassword = createAsyncThunk(
  'profile/changePassword',
  async (data: ChangePasswordDto, { rejectWithValue }) => {
    try {
      return await changePassword(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearViewedProfile: (state) => {
      state.viewedProfile = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch my profile
    builder.addCase(fetchMyProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.myProfile = action.payload;
    });
    builder.addCase(fetchMyProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch public profile
    builder.addCase(fetchPublicProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPublicProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.viewedProfile = action.payload;
    });
    builder.addCase(fetchPublicProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch user by ID
    builder.addCase(fetchUserById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.isLoading = false;
      // Could store this separately if needed
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update profile
    builder.addCase(updateMyProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateMyProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.myProfile = action.payload;
    });
    builder.addCase(updateMyProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Change password
    builder.addCase(updatePassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updatePassword.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearViewedProfile, clearError } = profileSlice.actions;
export default profileSlice.reducer;