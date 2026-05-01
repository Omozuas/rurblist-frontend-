'use client';

import React, { useState } from 'react';
import ProfileImage from '../profile-image/profile-image';
import { IconImage } from '../icon-image/icon-image';
import { CommentModel } from '@/app/apis/models/comment-model';
import { currentUserModel } from '@/app/apis/models/user-model';
import { useCommentMutation } from '@/app/apis/mutations/use-comments/use-post-comment-reply';
import { OrangeButton } from '../button/button';

interface CommentProps {
  comment: CommentModel;
  currentUser: currentUserModel | null;
  propertyId: string;
  showReplyAction?: boolean;
}

export default function Comment({
  comment,
  currentUser,
  propertyId,
  showReplyAction = true,
}: CommentProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { replyComment, isReplying } = useCommentMutation(propertyId);
  const validReplies = comment.replies?.filter((r) => r && r._id && r.text) || [];
  const hasReplies = validReplies.length > 0;
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const isCurrentUserComment = comment?.user?._id === currentUser?.user?._id;
  const commentProfileImage = isCurrentUserComment
    ? (comment?.user?.profileImage?.url ??
      currentUser?.agent?.selfieUrl?.url ??
      currentUser?.user?.profileImage?.url ??
      undefined)
    : (comment?.user?.profileImage?.url ?? undefined);

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    replyComment({
      parentCommentId: comment._id,
      text: replyText,
    });

    setReplyText('');
    setShowReplyInput(false);
    setShowReplies(true);
  };

  return (
    <div className="py-5 border-b border-gray-200 last:border-b-0">
      <div className="flex gap-3">
        <ProfileImage
          src={commentProfileImage}
          alt={comment?.user?.fullName || 'user'}
          // name={comment.user.fullName || 'user'}
          size="sm"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{comment.user.fullName}</h4>
            {comment.user?.roles?.length > 0 && (
              <span className="text-xs text-[#e87722]">{comment.user.roles[0]}</span>
            )}
          </div>

          <p className="text-xs text-gray-500 mb-2">{formattedDate}</p>

          <p className="text-gray-700 mb-3">{comment.text}</p>

          {/* Reply + Toggle */}
          <div className="flex items-center justify-between text-sm">
            {showReplyAction ? (
              <button
                onClick={() => setShowReplyInput((prev) => !prev)}
                className="text-[#e87722] font-medium"
              >
                Reply
              </button>
            ) : (
              <div />
            )}

            {hasReplies && (
              <button
                onClick={() => setShowReplies((prev) => !prev)}
                className="flex items-center gap-1 text-[#e87722]"
              >
                {validReplies.length} {validReplies.length === 1 ? 'response' : 'responses'}
                <IconImage
                  src="/icons/chevron-down.svg"
                  alt="toggle"
                  width={14}
                  height={14}
                  className={`transition-transform ${showReplies ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-4 flex gap-3">
              <ProfileImage
                src={
                  currentUser?.agent?.selfieUrl?.url ||
                  currentUser?.user?.profileImage?.url ||
                  '/image/profile-img.png'
                }
                alt={
                  `${currentUser?.agent?.firstName ?? ''} ${currentUser?.agent?.lastName ?? ''}`.trim() ||
                  currentUser?.user?.fullName ||
                  'user'
                }
                size="sm"
              />
              <div className="flex-1">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e87722]"
                />
                <OrangeButton
                  loading={isReplying}
                  onClick={handleSendReply}
                  className="mt-2 bg-[#e87722] text-white px-4 py-1.5 rounded-lg text-sm"
                >
                  Send
                </OrangeButton>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {showReplies && hasReplies && (
            <div className="mt-5 ml-8 border-l border-gray-200 pl-6 space-y-5">
              {validReplies.map((reply, index: number) => {
                const isLastReply = index === validReplies.length - 1;

                return (
                  <Comment
                    key={reply._id || `${reply.createdAt}-${index}`}
                    comment={reply}
                    currentUser={currentUser}
                    propertyId={propertyId}
                    showReplyAction={isLastReply}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
