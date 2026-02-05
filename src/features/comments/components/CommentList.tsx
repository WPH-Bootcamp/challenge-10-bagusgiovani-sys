'use client';

import { Comment, User } from '@/types';
import CommentItem from './CommentItem';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface CommentListProps {
  comments: Comment[];
  currentUser: User | null;
  onDelete: (commentId: number) => void;
  isLoading?: boolean;
}

export default function CommentList({
  comments,
  currentUser,
  onDelete,
  isLoading = false,
}: CommentListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUser={currentUser}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}