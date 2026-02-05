// features/profile/components/ProfileTabs.tsx
'use client';

interface ProfileTabsProps {
  activeTab: 'posts' | 'password';
  onTabChange: (tab: 'posts' | 'password') => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onTabChange('posts')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
            activeTab === 'posts'
              ? 'text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Your Post
          {activeTab === 'posts' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
          )}
        </button>
        
        <button
          onClick={() => onTabChange('password')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
            activeTab === 'password'
              ? 'text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Change Password
          {activeTab === 'password' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
          )}
        </button>
      </div>
    </div>
  );
}