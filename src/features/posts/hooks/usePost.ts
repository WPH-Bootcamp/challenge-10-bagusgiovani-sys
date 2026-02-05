/**
 * usePost Hook - Single post operations (view, create, update, delete, like)
 */

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchPostById,
  createNewPost,
  updateExistingPost,
  removePost,
  toggleLikePost,
  clearCurrentPost,
  clearError,
} from '../postSlice';
import { CreatePostDto, UpdatePostDto } from '@/types';

export const usePost = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentPost, isLoading, error } = useAppSelector((state) => state.posts);

  // Get post by ID
  const getPost = useCallback(async (id: number | string) => {
    try {
      await dispatch(fetchPostById(id)).unwrap();
    } catch (error) {
      console.error('Failed to fetch post:', error);
      throw error;
    }
  }, [dispatch]);

  // Create post
  const createPost = useCallback(async (data: CreatePostDto) => {
    try {
      const result = await dispatch(createNewPost(data)).unwrap();
      router.push(`/posts/${result.id}`);
      return result;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }, [dispatch, router]);

  // Update post
  const updatePost = useCallback(async (id: number | string, data: UpdatePostDto) => {
    try {
      const result = await dispatch(updateExistingPost({ id, data })).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    }
  }, [dispatch]);

  // Delete post
  const deletePost = useCallback(async (id: number | string) => {
    try {
      await dispatch(removePost(id)).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  }, [dispatch, router]);

  // Like/Unlike post
  const likePost = useCallback(async (id: number | string) => {
    try {
      await dispatch(toggleLikePost(id)).unwrap();
    } catch (error) {
      console.error('Failed to like post:', error);
      throw error;
    }
  }, [dispatch]);

  // Clear current post
  const clear = useCallback(() => {
    dispatch(clearCurrentPost());
  }, [dispatch]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    post: currentPost,
    isLoading,
    error,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    clear,
    clearError: resetError,
  };
};