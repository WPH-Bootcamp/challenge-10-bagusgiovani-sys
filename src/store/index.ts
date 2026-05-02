/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import postReducer from '@/features/posts/postSlice';
import commentReducer from '@/features/comments/commentSlice';
import profileReducer from '@/features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    comments: commentReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // File objects from image/avatar uploads are not serializable
        ignoredActionPaths: ['meta.arg.image', 'meta.arg.avatar'],
      },
    }),
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;