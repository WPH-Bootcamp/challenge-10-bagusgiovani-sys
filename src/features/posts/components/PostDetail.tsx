'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Post, User } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { useComment } from '@/features/comments/hooks/useComment';
import CommentList from '@/features/comments/components/CommentList';

interface PostDetailProps {
  post: Post;
  currentUser: User | null;
  onLike: () => void;
  onDelete: () => void;
  isLikeLoading?: boolean;
  isDeleteLoading?: boolean;
}

export default function PostDetail({
  post,
  currentUser,
  onLike,
  onDelete,
  isLikeLoading = false,
  isDeleteLoading = false,
}: PostDetailProps) {
  const router = useRouter();
  const { comments, getComments, addComment, deleteComment, isLoading: commentsLoading } = useComment();
  
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthor = currentUser?.id === post.author.id;

  const handleLike = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    onLike();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete();
    }
  };

  const handleToggleComments = async () => {
    if (!showComments) {
      // Load comments when opening
      await getComments(post.id);
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(post.id, { content: commentText });
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId, post.id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Cover Image */}
      {post.imageUrl && (
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <Link
            href={`/profile/${post.author.username}`}
            className="flex items-center gap-3 hover:opacity-80"
          >
            <Image
              src={post.author.avatarUrl || '/assets/images/default-avatar.png'}
              alt={post.author.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{post.author.name}</p>
              <p className="text-sm text-gray-600">@{post.author.username}</p>
            </div>
          </Link>
          <span className="text-gray-400">•</span>
          <time className="text-sm text-gray-600">
            {formatDate(post.createdAt)}
          </time>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none mb-8">
          <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={!currentUser || isLikeLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 17.5l-1.5-1.35C4.4 12.36 1.667 9.865 1.667 6.833c0-2.033 1.583-3.666 3.666-3.666 1.167 0 2.284.533 3 1.4.717-.867 1.834-1.4 3-1.4 2.084 0 3.667 1.633 3.667 3.666 0 3.034-2.733 5.527-6.833 9.317L10 17.5z" />
            </svg>
            <span className="font-medium">{post.likes || 0}</span>
          </button>

          {/* Comment Button - NOW CLICKABLE! */}
          <button
            onClick={handleToggleComments}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.5 8.333A5.833 5.833 0 0 1 11.667 14.167H5l-2.5 2.5v-12.5A2.5 2.5 0 0 1 5 1.667h10a2.5 2.5 0 0 1 2.5 2.5v4.166z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">{post.comments || 0}</span>
          </button>

          {/* Author Actions */}
          {isAuthor && (
            <div className="flex items-center gap-2 ml-auto">
              <Link
                href={`/write?id=${post.id}`}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M14.167 2.5a2.357 2.357 0 0 1 3.333 3.333L6.25 17.083l-4.583 1.25 1.25-4.583L14.167 2.5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleteLoading}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M2.5 5h15M8.333 8.333v5M11.667 8.333v5M3.333 5l.834 11.667c0 .916.75 1.666 1.666 1.666h8.334c.916 0 1.666-.75 1.666-1.666L16.667 5M6.667 5V3.333c0-.916.75-1.666 1.666-1.666h3.334c.916 0 1.666.75 1.666 1.666V5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Comments ({comments.length})
            </h3>

            {/* Add Comment Form */}
            {currentUser ? (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-3">
                  <Image
                    src={currentUser.avatarUrl || '/assets/images/default-avatar.png'}
                    alt={currentUser.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!commentText.trim() || isSubmitting}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">
                  <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                    Log in
                  </Link>
                  {' '}to comment
                </p>
              </div>
            )}

            {/* Comments List */}
            <CommentList
              comments={comments}
              currentUser={currentUser}
              onDelete={handleDeleteComment}
              isLoading={commentsLoading}
            />
          </div>
        )}
      </div>
    </article>
  );
}