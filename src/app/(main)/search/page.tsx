// app/(main)/search/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePosts } from "@/features/posts/hooks/usePosts";
import PostCard from "@/features/posts/components/PostCard";
import Pagination from "@/components/ui/Pagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    posts,
    total,
    page,
    lastPage,
    isLoading,
    error,
    searchPosts,
    likePost,
  } = usePosts();

  useEffect(() => {
    if (query) {
      searchPosts({ query, page: currentPage, limit });
    }
  }, [query, currentPage, searchPosts]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLike = async (postId: number) => {
    await likePost(postId);
  };

  // Loading state
  if (isLoading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="layout-gutter py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Results
            </h1>
            <p className="text-gray-600">
              {query ? (
                <>
                  Found <span className="font-semibold">{total}</span> result
                  {total !== 1 ? "s" : ""} for "
                  <span className="font-semibold">{query}</span>"
                </>
              ) : (
                "Enter a search query to find posts"
              )}
            </p>
          </div>

          {/* No Results */}
          {!isLoading && posts.length === 0 && query && (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or browse all posts
              </p>

              <a
                href="/"
                className="inline-block px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Browse Posts
              </a>
            </div>
          )}

          {/* Search Results */}
          {posts.length > 0 && (
            <>
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLikeClick={() => handleLike(post.id)}
                  />
                ))}
              </div>

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
            </>
          )}
        </div>
      </div>
    </main>
  );
}
