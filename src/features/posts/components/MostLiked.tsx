// features/posts/components/MostLiked.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePosts } from '../hooks/usePosts';
import { formatDate } from '@/utils/formatDate';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Post } from '@/types';

interface MostLikedItemProps {
  post: Post;
}

function MostLikedItem({ post }: MostLikedItemProps) {
  const { id, title, tags, author, createdAt, likes, comments } = post;

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      {/* Title */}
      <Link href={`/posts/${id}`}>
        <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {title}
        </h4>
      </Link>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Author & Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-700">{author.name}</span>
          <span>•</span>
          <span>{formatDate(createdAt)}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Likes */}
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="font-medium">{likes}</span>
          </div>

          {/* Comments */}
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="font-medium">{comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MostLiked() {
  const { posts, isLoading, getMostLiked } = usePosts();

  useEffect(() => {
    getMostLiked({ limit: 5, page: 1 });
  }, [getMostLiked]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">Most Liked</h3>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : posts.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            No popular posts yet
          </div>
        ) : (
          posts.map((post) => <MostLikedItem key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}