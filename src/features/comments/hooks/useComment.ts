import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchComments, createComment, removeComment, clearComments } from '../commentSlice';
import { CreateCommentDto } from '@/types';

export const useComment = () => {
  const dispatch = useAppDispatch();
  const { comments, isLoading, error } = useAppSelector((state) => state.comments);

  // Fetch comments for a post
  const getComments = useCallback(async (postId: number | string) => {
    try {
      await dispatch(fetchComments(postId)).unwrap();
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      throw error;
    }
  }, [dispatch]);

  // Add a comment to a post
  const addComment = useCallback(async (postId: number | string, data: CreateCommentDto) => {
    try {
      await dispatch(createComment({ postId, data })).unwrap();
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  }, [dispatch]);

  // Delete comment - NOW ACCEPTS BOTH commentId AND postId
  const deleteComment = useCallback(async (commentId: number | string, postId: number | string) => {
    try {
      await dispatch(removeComment({ commentId, postId })).unwrap();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  }, [dispatch]);

  // Clear comments
  const clearAllComments = useCallback(() => {
    dispatch(clearComments());
  }, [dispatch]);

  return {
    comments,
    isLoading,
    error,
    getComments,
    addComment,
    deleteComment,
    clearAllComments,
  };
};