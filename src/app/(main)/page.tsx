// app/(main)/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePosts } from '@/features/posts/hooks/usePosts';
import PostList from '@/features/posts/components/PostList';
import MostLiked from '@/features/posts/components/MostLiked';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  const { 
    posts, 
    total,
    page,
    lastPage,
    isLoading, 
    error,
    getRecommended,
  } = usePosts();

  // Fetch recommended posts when page changes
  useEffect(() => {
    getRecommended({ page: currentPage, limit });
  }, [currentPage, getRecommended]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isLoading && posts.length === 0) {
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
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="layout-gutter py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Content - Recommended Posts */}
          <div className="lg:col-span-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recommend For You</h2>
            </div>
            
            <PostList type="recommended" limit={limit} initialPage={currentPage} />
            
            {/* Pagination */}
            {lastPage > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={lastPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Most Liked Posts */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-6">
              <MostLiked />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}