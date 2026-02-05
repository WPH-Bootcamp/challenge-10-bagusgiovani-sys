/**
 * usePosts Hook - Posts listing logic
 */

'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchRecommendedPosts,
  fetchMostLikedPosts,
  fetchMyPosts,
  fetchSearchPosts,
  toggleLikePost,  
  clearError,
  setPosts,
} from '../postSlice';
import { PaginationParams, SearchParams } from '@/types';

export const usePosts = () => {
  const dispatch = useAppDispatch();
  const { posts, total, page, lastPage, isLoading, error } = useAppSelector((state) => state.posts);

  // Get recommended posts (homepage)
  const getRecommended = useCallback(async (params?: PaginationParams) => {
    try {
      await dispatch(fetchRecommendedPosts(params)).unwrap();
    } catch (error) {
      console.error('Failed to fetch recommended posts:', error);
    }
  }, [dispatch]);

  // Get most liked posts
  const getMostLiked = useCallback(async (params?: PaginationParams) => {
    try {
      await dispatch(fetchMostLikedPosts(params)).unwrap();
    } catch (error) {
      console.error('Failed to fetch most liked posts:', error);
    }
  }, [dispatch]);

  // Get my posts
  const getMyPosts = useCallback(async (params?: PaginationParams) => {
    try {
      await dispatch(fetchMyPosts(params)).unwrap();
    } catch (error) {
      console.error('Failed to fetch my posts:', error);
    }
  }, [dispatch]);

  // Search posts
  const searchPosts = useCallback(async (searchParams: SearchParams) => {
    try {
      await dispatch(fetchSearchPosts(searchParams)).unwrap();
    } catch (error) {
      console.error('Failed to search posts:', error);
    }
  }, [dispatch]);

  // ✅ Added: Like/Unlike a post
  const likePost = useCallback(async (postId: number | string) => {
    try {
      await dispatch(toggleLikePost(postId)).unwrap();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  }, [dispatch]);

  // Clear posts
  const clear = useCallback(() => {
    dispatch(setPosts([]));
  }, [dispatch]);

  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    posts,
    total,
    page,
    lastPage,
    isLoading,
    error,
    getRecommended,
    getMostLiked,
    getMyPosts,
    searchPosts,
    likePost,      
    clear,
    clearError: resetError,
  };
};