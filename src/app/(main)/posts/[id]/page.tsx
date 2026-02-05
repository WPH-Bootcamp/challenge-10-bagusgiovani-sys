'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePost } from '@/features/posts/hooks/usePost';
import PostDetail from '@/features/posts/components/PostDetail';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function PostDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const { post, getPost, deletePost, likePost, isLoading, error } = usePost();

  const postId = params.id as string;

  // Fetch post on mount
  useEffect(() => {
    if (postId) {
      getPost(postId);
    }
  }, [postId]);

  // Loading state
  if (isLoading && !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <ErrorMessage message={error} />
          <Link
            href="/"
            className="mt-4 block text-center text-blue-500 hover:text-blue-600"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  // No post found
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h1>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-600"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M15 10H5M10 15l-5-5 5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to posts
        </Link>

        {/* Post Detail Component */}
        <PostDetail
          post={post}
          currentUser={user}
          onLike={() => likePost(postId)}
          onDelete={() => deletePost(postId)}
        />
      </div>
    </div>
  );
}