/**
 * Post Slice - Redux state for posts
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getRecommendedPosts,
  getMostLikedPosts,
  getMyPosts,
  searchPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from './post.service';
import { Post, PaginatedResponse, CreatePostDto, UpdatePostDto, SearchParams, PaginationParams } from '@/types';
import { getErrorMessage } from '@/lib/api';
import { createComment, removeComment } from '../comments/commentSlice';

// State interface
interface PostState {
  posts: Post[];
  currentPost: Post | null;
  total: number;
  page: number;
  lastPage: number;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: PostState = {
  posts: [],
  currentPost: null,
  total: 0,
  page: 1,
  lastPage: 1,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchRecommendedPosts = createAsyncThunk(
  'posts/fetchRecommended',
  async (params: PaginationParams | undefined, { rejectWithValue }) => {
    try {
      return await getRecommendedPosts(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchMostLikedPosts = createAsyncThunk(
  'posts/fetchMostLiked',
  async (params: PaginationParams | undefined, { rejectWithValue }) => {
    try {
      return await getMostLikedPosts(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchMyPosts = createAsyncThunk(
  'posts/fetchMyPosts',
  async (params: PaginationParams | undefined, { rejectWithValue }) => {
    try {
      return await getMyPosts(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchSearchPosts = createAsyncThunk(
  'posts/search',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      return await searchPosts(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchById',
  async (id: number | string, { rejectWithValue }) => {
    try {
      return await getPostById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createNewPost = createAsyncThunk(
  'posts/create',
  async (data: CreatePostDto, { rejectWithValue }) => {
    try {
      return await createPost(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateExistingPost = createAsyncThunk(
  'posts/update',
  async ({ id, data }: { id: number | string; data: UpdatePostDto }, { rejectWithValue }) => {
    try {
      return await updatePost(id, data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const removePost = createAsyncThunk(
  'posts/delete',
  async (id: number | string, { rejectWithValue }) => {
    try {
      await deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  'posts/like',
  async (id: number | string, { rejectWithValue }) => {
    try {
      return await likePost(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch recommended posts
    builder.addCase(fetchRecommendedPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchRecommendedPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.lastPage = action.payload.lastPage;
    });
    builder.addCase(fetchRecommendedPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch most liked posts
    builder.addCase(fetchMostLikedPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMostLikedPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.lastPage = action.payload.lastPage;
    });
    builder.addCase(fetchMostLikedPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch my posts
    builder.addCase(fetchMyPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.lastPage = action.payload.lastPage;
    });
    builder.addCase(fetchMyPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Search posts
    builder.addCase(fetchSearchPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSearchPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.lastPage = action.payload.lastPage;
    });
    builder.addCase(fetchSearchPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch post by ID
    builder.addCase(fetchPostById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPostById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentPost = action.payload;
    });
    builder.addCase(fetchPostById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create post
    builder.addCase(createNewPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createNewPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts.unshift(action.payload);
    });
    builder.addCase(createNewPost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update post
    builder.addCase(updateExistingPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateExistingPost.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      if (state.currentPost?.id === action.payload.id) {
        state.currentPost = action.payload;
      }
    });
    builder.addCase(updateExistingPost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete post
    builder.addCase(removePost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removePost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = state.posts.filter(p => p.id !== action.payload);
    });
    builder.addCase(removePost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Like post
    builder.addCase(toggleLikePost.fulfilled, (state, action) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      if (state.currentPost?.id === action.payload.id) {
        state.currentPost = action.payload;
      }
    });

    // ========================================
    // COMMENT COUNT UPDATES
    // ========================================
    
    // Update post comment count when comment is added
    builder.addCase(createComment.fulfilled, (state, action) => {
      const postId = action.payload.post?.id;
      if (postId) {
        // Update in posts list
        const postIndex = state.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments += 1;
        }
        // Update current post
        if (state.currentPost && state.currentPost.id === postId) {
          state.currentPost.comments += 1;
        }
      }
    });

    // Update post comment count when comment is deleted
    builder.addCase(removeComment.fulfilled, (state, action) => {
      // Get postId from the payload
      const postId = action.payload.postId;
      if (postId) {
        // Update in posts list
        const postIndex = state.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments = Math.max(0, state.posts[postIndex].comments - 1);
        }
        // Update current post
        if (state.currentPost && state.currentPost.id === postId) {
          state.currentPost.comments = Math.max(0, state.currentPost.comments - 1);
        }
      }
    });
  },
});

export const { clearCurrentPost, clearError, setPosts } = postSlice.actions;
export default postSlice.reducer;