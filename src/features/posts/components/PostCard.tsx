// features/posts/components/PostCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import { formatDate } from '@/utils/formatDate';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  isLiked?: boolean;
  onLikeClick?: () => void;
}

export default function PostCard({
  post,
  isLiked = false,
  onLikeClick,
}: PostCardProps) {
  const {
    id,
    title,
    content,
    tags,
    imageUrl,
    author,
    createdAt,
    likes,
    comments,
  } = post;

  // Truncate content to ~150 characters
  const truncatedContent = content.length > 150 
    ? content.substring(0, 150) + '...' 
    : content;

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image - Desktop only, only if imageUrl exists */}
        {imageUrl && (
          <Link 
            href={`/posts/${id}`}
            className="hidden md:block flex-shrink-0"
          >
            <div className="w-[200px] h-[140px] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imageUrl}
                alt={title}
                width={200}
                height={140}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Title */}
          <div>
            <Link href={`/posts/${id}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content excerpt */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {truncatedContent}
            </p>
          </div>

          {/* Author & Actions */}
          <div className="flex items-center justify-between">
            {/* Author info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {author.avatarUrl ? (
                  <Image
                    src={author.avatarUrl}
                    alt={author.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-semibold">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {author.name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(createdAt)}
                </span>
              </div>
            </div>

            {/* Like & Comment actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Like button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onLikeClick?.();
                }}
                className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors"
              >
                <svg
                  className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'fill-none'}`}
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
                <span className="text-sm font-medium">{likes}</span>
              </button>

              {/* Comment link */}
              <Link
                href={`/posts/${id}#comments`}
                className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors"
              >
                <Image
                  src="/assets/icons/comment.svg"
                  alt="Comments"
                  width={20}
                  height={20}
                />
                <span className="text-sm font-medium">{comments}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}