'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCommentMutation } from '@/app/apis/mutations/use-comments/use-post-comment-reply';
import { useLikeProperty } from '@/app/apis/mutations/use-property/use-like-unlike';
import { useSaveProperty } from '@/app/apis/mutations/use-property/use-save-unsave-property';
import { optimizeCloudinaryImage } from '@/app/apis/utils/cloudinary';
import {
  getLocalPropertyState,
  LocalPropertyReaction,
  setLocalPropertyState,
} from '@/app/apis/utils/property-local-state';
import { OrangeButton } from '../button/button';
import { IconImage } from '../icon-image/icon-image';
import ProfileImage from '../profile-image/profile-image';
import ReadMoreText from '../read-more';

const CommentModal = dynamic(() => import('../comment/comment-modal'), {
  ssr: false,
});

interface GalleryImage {
  id: string;
  url: string;
}

type UserReference = string | { _id?: string };
type Reaction = LocalPropertyReaction;

function getUserReferenceId(user: UserReference) {
  return typeof user === 'string' ? user : user._id;
}

interface PropertyCardProps {
  title: string;
  id: string;
  mainImage: string;
  galleryImages: GalleryImage[];
  description: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  profileImage: string;
  profileName: string;
  likeCount: number;
  unlikeCount: number;
  listLike: UserReference[];
  listunlike: UserReference[];
  savedList: UserReference[];
  currentUserId: string;
  createdAt: string;
  agentFee: string;
  commentCount: number;
  type?: string;
  verificationStatus?: string;
  onChatClick?: () => void;
}

export default function PropertyCard({
  title,
  id,
  listLike,
  listunlike,
  likeCount,
  unlikeCount,
  currentUserId,
  mainImage,
  galleryImages,
  description,
  price,
  savedList,
  bedrooms,
  agentFee,
  commentCount,
  verificationStatus,
  profileImage,
  profileName,
  type,
  createdAt,
  onChatClick,
}: PropertyCardProps) {
  const router = useRouter();
  const { like, unlike, isLiking, isUnliking } = useLikeProperty();
  const { save, unsave, isSaving, isUnSaving } = useSaveProperty();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { postComment, isPosting } = useCommentMutation(id);

  const backendReaction = useMemo<Reaction>(() => {
    const liked = listLike?.some((user) => getUserReferenceId(user) === currentUserId);
    const unliked = listunlike?.some((user) => getUserReferenceId(user) === currentUserId);

    if (liked) return 'like';
    if (unliked) return 'unlike';
    return null;
  }, [listLike, listunlike, currentUserId]);

  const backendIsSaved = useMemo(() => {
    return savedList?.some((user) => getUserReferenceId(user) === id);
  }, [savedList, id]);

  const [reaction, setReaction] = useState<Reaction>(backendReaction);
  const [likes, setLikes] = useState(likeCount);
  const [unlikes, setUnlikes] = useState(unlikeCount);
  const [isSaved, setIsSaved] = useState(backendIsSaved);
  const hydratedStorageKey = useRef('');

  useEffect(() => {
    const storageKey = `${currentUserId}:${id}`;

    if (hydratedStorageKey.current === storageKey) return;

    const frame = window.requestAnimationFrame(() => {
      const stored = getLocalPropertyState(id, currentUserId);
      hydratedStorageKey.current = storageKey;

      if (stored) {
        setReaction(stored.reaction ?? null);
        setIsSaved(stored.isSaved ?? backendIsSaved);
        setLikes(stored.likes ?? likeCount);
        setUnlikes(stored.unlikes ?? unlikeCount);
        return;
      }

      setReaction(backendReaction);
      setIsSaved(backendIsSaved);
      setLikes(likeCount);
      setUnlikes(unlikeCount);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [id, currentUserId, backendReaction, backendIsSaved, likeCount, unlikeCount]);

  const persistState = (nextState: {
    reaction: Reaction;
    isSaved: boolean;
    likes: number;
    unlikes: number;
  }) => {
    setLocalPropertyState(id, currentUserId, nextState);
  };

  const displayImage =
    currentImageIndex === 0
      ? optimizeCloudinaryImage(mainImage, { width: 900 })
      : optimizeCloudinaryImage(galleryImages[currentImageIndex - 1]?.url, { width: 900 });

  const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const isVerified = verificationStatus?.toLowerCase() === 'verified';
  const verificationLabel = isVerified ? 'Verified' : 'Unverified';

  const handleLike = () => {
    const previous = { reaction, isSaved, likes, unlikes };
    const nextReaction: Reaction = reaction === 'like' ? null : 'like';
    const nextLikes = reaction === 'like' ? Math.max(likes - 1, 0) : likes + 1;
    const nextUnlikes = reaction === 'unlike' ? Math.max(unlikes - 1, 0) : unlikes;

    setReaction(nextReaction);
    setLikes(nextLikes);
    setUnlikes(nextUnlikes);
    persistState({
      reaction: nextReaction,
      isSaved,
      likes: nextLikes,
      unlikes: nextUnlikes,
    });

    like(id, {
      onError: () => {
        setReaction(previous.reaction);
        setIsSaved(previous.isSaved);
        setLikes(previous.likes);
        setUnlikes(previous.unlikes);
        persistState(previous);
      },
    });
  };

  const handleUnlike = () => {
    const previous = { reaction, isSaved, likes, unlikes };
    const nextReaction: Reaction = reaction === 'unlike' ? null : 'unlike';
    const nextUnlikes = reaction === 'unlike' ? Math.max(unlikes - 1, 0) : unlikes + 1;
    const nextLikes = reaction === 'like' ? Math.max(likes - 1, 0) : likes;

    setReaction(nextReaction);
    setLikes(nextLikes);
    setUnlikes(nextUnlikes);
    persistState({
      reaction: nextReaction,
      isSaved,
      likes: nextLikes,
      unlikes: nextUnlikes,
    });

    unlike(id, {
      onError: () => {
        setReaction(previous.reaction);
        setIsSaved(previous.isSaved);
        setLikes(previous.likes);
        setUnlikes(previous.unlikes);
        persistState(previous);
      },
    });
  };

  const handleSave = () => {
    const previous = { reaction, isSaved, likes, unlikes };
    const nextSaved = !isSaved;
    const mutation = nextSaved ? save : unsave;

    setIsSaved(nextSaved);
    persistState({
      reaction,
      isSaved: nextSaved,
      likes,
      unlikes,
    });

    mutation(id, {
      onError: () => {
        setReaction(previous.reaction);
        setIsSaved(previous.isSaved);
        setLikes(previous.likes);
        setUnlikes(previous.unlikes);
        persistState(previous);
      },
    });
  };

  const handlePostComment = () => {
    const trimmedComment = commentText.trim();

    if (!trimmedComment) return;

    postComment(trimmedComment);
    setCommentText('');
  };

  const handleOpenProperty = () => {
    router.push(`/property/${id}`);
  };

  return (
    <div className="mb-10 bg-white">
      <button type="button" onClick={handleOpenProperty} className="mb-6 text-left">
        <h2 className="text-2xl font-semibold text-gray-900 transition-colors hover:text-[#e87722]">
          {title}
        </h2>
      </button>

      <div
        className="relative h-99.75 w-full cursor-pointer overflow-hidden"
        onClick={handleOpenProperty}
      >
        <Image
          src={displayImage || '/image/image7.jpg'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover"
        />

        <div
          className={`absolute left-4 top-4 rounded-full px-4 py-1 text-sm text-white ${
            isVerified ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {verificationLabel}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          disabled={isSaving || isUnSaving}
          className="absolute right-4 top-4 p-3"
        >
          <IconImage
            src={isSaved ? '/icons/orange-heart.svg' : '/icons/heart.svg'}
            alt="save"
            width={35}
            height={35}
            className={`transition ${
              isSaved ? 'fill-[#e87722] stroke-[#e87722]' : 'fill-white stroke-white'
            }`}
          />
        </button>
      </div>

      <div className="mt-5 hidden gap-5 overflow-x-auto sm:flex">
        {[{ id: 'main', url: mainImage }, ...galleryImages].map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setCurrentImageIndex(idx)}
            className="relative h-25 w-40.75 overflow-hidden"
          >
            <Image
              src={optimizeCloudinaryImage(img.url, { width: 180 }) || '/image/image7.jpg'}
              alt="gallery"
              fill
              sizes="163px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <ReadMoreText
            text={description ?? 'No description available.'}
            className="mb-6 text-sm leading-relaxed text-gray-700"
            maxLength={300}
          />
          {bedrooms > 0 && (
            <p className="mb-1 text-sm text-gray-700">
              {bedrooms} bedroom{bedrooms > 1 ? 's' : ''} {type}
            </p>
          )}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-black md:text-3xl">{price}</h3>
            <p className="text-sm text-gray-600">Agent fee: {agentFee}</p>
          </div>

          <div className="mb-6 md:hidden">
            <div className="flex items-center gap-4">
              <ProfileImage src={profileImage} alt={profileName} size="md" />
              <div>
                <p className="font-semibold text-gray-900">{profileName}</p>
                <p className="text-xs text-gray-500">Posted on {formattedDate}</p>
              </div>
            </div>

            <OrangeButton variant="orange" className="mt-4 px-6 py-2 text-sm" onClick={onChatClick}>
              CHAT
            </OrangeButton>
          </div>

          <div className="mb-10 flex items-center gap-6 text-sm text-gray-600">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 transition ${
                reaction === 'like' ? 'text-[#e87722]' : ''
              }`}
            >
              {likes}
              <IconImage src="/icons/thumbs-up.svg" alt="like" width={20} height={20} />
            </button>

            <button
              onClick={handleUnlike}
              disabled={isUnliking}
              className={`flex items-center gap-2 transition ${
                reaction === 'unlike' ? 'text-red-500' : ''
              }`}
            >
              {unlikes}
              <IconImage src="/icons/thumbs-down.svg" alt="unlike" width={20} height={20} />
            </button>

            <button onClick={() => setIsCommentModalOpen(true)} className="flex items-center gap-2">
              {commentCount}
              <IconImage src="/icons/message-circle.svg" alt="comments" width={20} height={20} />
            </button>
          </div>

          <div className="mt-12">
            <h4 className="mb-6 text-lg font-semibold">Leave a Reply</h4>

            <div className="max-w-2xl space-y-5">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Your comment here..."
                rows={7}
                className="w-full resize-none rounded-lg border border-[#808080] bg-white px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#e87722]"
              />
              <OrangeButton
                variant="gray"
                className="mt-2 px-6 py-2 text-sm"
                onClick={handlePostComment}
                loading={isPosting}
                disabled={!commentText.trim() || isPosting}
              >
                Post comment
              </OrangeButton>
            </div>
          </div>
        </div>

        <div className="hidden justify-end md:flex">
          <div className="flex items-start gap-4">
            <ProfileImage src={profileImage} alt={profileName} size="lg" />

            <div className="flex flex-col items-start">
              <p className="font-semibold text-gray-900">{profileName}</p>
              <p className="text-xs text-gray-500">Posted on {formattedDate}</p>

              <OrangeButton
                variant="orange"
                className="mt-3 px-7 py-2 text-[12px]"
                onClick={onChatClick}
              >
                CHAT
              </OrangeButton>
            </div>
          </div>
        </div>
      </div>

      {isCommentModalOpen && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          id={id}
        />
      )}
    </div>
  );
}
