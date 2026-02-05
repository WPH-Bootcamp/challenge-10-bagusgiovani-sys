'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Comment, User } from '@/types';
import { formatDate } from '@/utils/formatDate';

interface CommentItemProps {
  comment: Comment;
  currentUser: User | null;
  onDelete: (commentId: number) => void;
}

export default function CommentItem({ comment, currentUser, onDelete }: CommentItemProps) {
  const isAuthor = currentUser?.id === comment.author.id;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
    }
  };

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      <Link href={`/profile/${comment.author.username}`}>
        <Image
          src={comment.author.avatarUrl || '/assets/images/default-avatar.png'}
          alt={comment.author.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      </Link>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/profile/${comment.author.username}`}
            className="font-semibold text-gray-900 hover:text-blue-600"
          >
            {comment.author.name}
          </Link>
          <span className="text-sm text-gray-500">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
        
        {/* Delete button for comment author */}
        {isAuthor && (
          <button
            onClick={handleDelete}
            className="mt-2 text-sm text-red-600 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}