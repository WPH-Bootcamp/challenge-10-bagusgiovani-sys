// app/(main)/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import ProfileTabs from '@/features/profile/components/ProfileTabs';
import ProfilePosts from '@/features/profile/components/ProfilePosts';
import ChangePasswordForm from '@/features/profile/components/ChangePasswordForm';
import EditProfileModal from '@/features/profile/components/EditProfileModal';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loadUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'password'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!user) {
      loadUser();
    }
  }, [isAuthenticated, user, router, loadUser]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
                src={user.avatarUrl || '/assets/images/default-avatar.png'}
                alt={user.name}
                width={120}
                height={120}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 mt-1">@{user.username}</p>
              
              <button
                onClick={() => setShowEditModal(true)}
                className="mt-4 px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'posts' ? (
            <ProfilePosts />
          ) : (
            <ChangePasswordForm />
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
        />
      )}
    </div>
  );
}