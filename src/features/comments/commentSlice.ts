/**
 * Comment Slice - Redux state for comments
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getComments, addComment, deleteComment } from './comment.service';
import { Comment, CreateCommentDto } from '@/types';
import { getErrorMessage } from '@/lib/api';

// State interface
interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: CommentState = {
  comments: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetch',
  async (postId: number | string, { rejectWithValue }) => {
    try {
      return await getComments(postId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/create',
  async ({ postId, data }: { postId: number | string; data: CreateCommentDto }, { rejectWithValue }) => {
    try {
      return await addComment(postId, data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const removeComment = createAsyncThunk(
  'comments/delete',
  async ({ commentId, postId }: { commentId: number | string; postId: number | string }, { rejectWithValue }) => {
    try {
      await deleteComment(commentId);
      return { commentId, postId };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch comments
    builder.addCase(fetchComments.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.comments = action.payload;
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create comment
    builder.addCase(createComment.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.comments.push(action.payload);
    });
    builder.addCase(createComment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete comment
    builder.addCase(removeComment.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeComment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.comments = state.comments.filter(c => c.id !== action.payload.commentId);
    });
    builder.addCase(removeComment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearComments, clearError } = commentSlice.actions;
export default commentSlice.reducer;