'use client';

import { useState, useMemo } from 'react';
import Comment from './comment';
import CommentModalSkeleton from './comment-modal-skeleton';
import { usePropertyComments } from '@/app/apis/mutations/use-comments/use-get-comments';
import { CommentModel } from '@/app/apis/models/comment-model';
import { useAuth } from '../layout/auth-provider';
import LoadMoreTrigger from '../load-more-trigger';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string; // propertyId
}

export default function CommentModal({ isOpen, onClose, id }: CommentModalProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const user = useAuth();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePropertyComments(id);

  // ✅ flatten pages
  const comments = useMemo(() => {
    const flat =
      data?.pages.flatMap((page) => page.data).filter((c): c is CommentModel => !!c) ?? [];

    return sortBy === 'oldest' ? [...flat].reverse() : flat;
  }, [data, sortBy]);

  if (!isOpen) return null;
  const currentUser = user.user;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button onClick={onClose} className="text-xl font-bold text-gray-900">
            ✕
          </button>

          <h2 className="text-xl font-bold text-gray-900">Comments</h2>

          <div className="w-6" />
        </div>

        {/* Sort */}
        <div className="px-4 pt-4 flex items-center gap-2">
          <span className="text-sm text-gray-700">≡ ↑</span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="text-sm font-medium text-gray-700 bg-transparent cursor-pointer hover:underline"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Comments List */}
        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4">
          {/* Loading */}
          {isLoading && <CommentModalSkeleton />}

          {/* Comments */}
          {!isLoading &&
            comments.map((comment) => (
              <Comment
                key={comment?._id}
                comment={comment}
                currentUser={currentUser}
                propertyId={id}
              />
            ))}

          <LoadMoreTrigger
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
            showNoMore={comments.length > 0}
          />

          {/* Empty */}
          {!isLoading && comments.length === 0 && (
            <p className="text-sm text-gray-500 text-center">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
