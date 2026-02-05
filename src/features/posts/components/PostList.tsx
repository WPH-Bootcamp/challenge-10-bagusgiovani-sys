// features/posts/components/PostList.tsx
'use client';

import { useEffect } from 'react';
import { usePosts } from '../hooks/usePosts';
import PostCard from './PostCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface PostListProps {
  type?: 'recommended' | 'mostLiked' | 'myPosts';
  initialPage?: number;
  limit?: number;
}

export default function PostList({ 
  type = 'recommended', 
  initialPage = 1,
  limit = 10 
}: PostListProps) {
  const { 
    posts, 
    isLoading, 
    error, 
    getRecommended, 
    getMostLiked, 
    getMyPosts,
    likePost,
    clearError 
  } = usePosts();

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      const params = { page: initialPage, limit };
      
      switch (type) {
        case 'mostLiked':
          await getMostLiked(params);
          break;
        case 'myPosts':
          await getMyPosts(params);
          break;
        case 'recommended':
        default:
          await getRecommended(params);
          break;
      }
    };

    fetchPosts();
  }, [type, initialPage, limit, getRecommended, getMostLiked, getMyPosts]);

  // Handle like toggle
  const handleLike = async (postId: number) => {
    await likePost(postId);
  };

  // Loading state
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage message={error} />
      </div>
    );
  }

  // Empty state
  if (!isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-600 mb-6">
          {type === 'myPosts' 
            ? "You haven't created any posts yet. Share your thoughts!" 
            : "No posts available at the moment."}
        </p>
      </div>
    );
  }

  // Posts list
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard 
          key={post.id}
          post={post}
          onLikeClick={() => handleLike(post.id)}
        />
      ))}
    </div>
  );
}