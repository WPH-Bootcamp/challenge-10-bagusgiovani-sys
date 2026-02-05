// app/(main)/profile/[username]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfile } from '@/features/profile/hooks/useProfile';
import PostCard from '@/features/posts/components/PostCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user: currentUser } = useAuth();
  const { viewedProfile, isLoading, error, getPublicProfile } = useProfile();

  useEffect(() => {
    if (username) {
      // If viewing own profile, redirect to /profile
      if (currentUser?.username === username) {
        router.push('/profile');
        return;
      }

      getPublicProfile(username);
    }
  }, [username, currentUser, getPublicProfile, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <ErrorMessage message={error} />
          <button
            onClick={() => router.push('/')}
            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // No profile found
  if (!viewedProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="layout-gutter py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <Image
                src={viewedProfile.avatarUrl || '/assets/images/default-avatar.png'}
                alt={viewedProfile.name}
                width={120}
                height={120}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{viewedProfile.name}</h1>
              <p className="text-gray-500 mt-1">@{viewedProfile.username}</p>
              {viewedProfile.headline && (
                <p className="text-gray-700 mt-2">{viewedProfile.headline}</p>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Posts</h2>
          
          {/* Loading Posts */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          )}

          {/* No Posts */}
          {!isLoading && (!viewedProfile.posts?.data || viewedProfile.posts.data.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts yet</p>
            </div>
          )}

          {/* Posts List */}
          {!isLoading && viewedProfile.posts?.data && viewedProfile.posts.data.length > 0 && (
            <div className="space-y-4">
              {viewedProfile.posts.data.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}