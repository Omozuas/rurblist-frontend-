'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { OrangeButton } from '../button/button';
import ProfileImage from '../profile-image/profile-image';
import CommentModal from '../comment/comment-modal';
import { IconImage } from '../icon-image/icon-image';
import { useRouter } from 'next/navigation';
import { useLikeProperty } from '@/app/apis/mutations/use-property/use-like-unlike';
import { useSaveProperty } from '@/app/apis/mutations/use-property/use-save-unsave-property';
import { useCommentMutation } from '@/app/apis/mutations/use-comments/use-post-comment-reply';
import ReadMoreText from '../read-more';

interface GalleryImage {
  id: string;
  url: string;
}

type UserReference = string | { _id?: string };

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
  // comments: CommentType[]
  listLike: UserReference[];
  listunlike: UserReference[];
  savedList: UserReference[]; // users who saved
  currentUserId: string; // ✅ REQUIRED
  createdAt: string; // ✅ NEW
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
  // comments,
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
  // ✅ Detect user reaction from backend lists
  const reaction = useMemo<'like' | 'unlike' | null>(() => {
    const liked = listLike?.some((user) => getUserReferenceId(user) === currentUserId);
    const unliked = listunlike?.some((user) => getUserReferenceId(user) === currentUserId);

    if (liked) return 'like';
    if (unliked) return 'unlike';
    return null;
  }, [listLike, listunlike, currentUserId]);

  // ✅ Optimistic UI counts
  const likes = likeCount;
  const unlikes = unlikeCount;

  const isSaved = useMemo(() => {
    return savedList?.some((user) => getUserReferenceId(user) === id);
  }, [savedList, id]);
  // ✅ Optimize Cloudinary image
  const optimizeImage = (url: string) => url?.replace('/upload/', '/upload/w_800,q_auto,f_auto/');

  const displayImage =
    currentImageIndex === 0
      ? optimizeImage(mainImage)
      : optimizeImage(galleryImages[currentImageIndex - 1]?.url);

  // ✅ Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const isVerified = verificationStatus?.toLowerCase() === 'verified';
  const verificationLabel = isVerified ? 'Verified' : 'Unverified';

  // ✅ HANDLE LIKE
  const handleLike = () => {
    if (reaction === 'like') {
      // toggle off → call unlike API
      like(id);
    } else {
      like(id);
    }
  };

  // ✅ HANDLE UNLIKE
  const handleUnlike = () => {
    if (reaction === 'unlike') {
      unlike(id); // toggle off
    } else {
      unlike(id); // assuming backend handles dislike toggle
    }
  };
  const handleSave = () => {
    if (isSaved) {
      unsave(id);
    } else {
      save(id);
    }
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
    <div className="bg-white mb-10">
      {/* Title */}
      <button type="button" onClick={handleOpenProperty} className="mb-6 text-left">
        <h2 className="text-2xl font-semibold text-gray-900 hover:text-[#e87722] transition-colors">
          {title}
        </h2>
      </button>

      {/* Main Image */}
      <div
        className="relative w-full h-99.75 overflow-hidden cursor-pointer"
        onClick={handleOpenProperty}
      >
        <Image src={displayImage} alt={title} fill className="object-cover" />

        {/* Verified badge */}
        <div
          className={`absolute top-4 left-4 text-white text-sm px-4 py-1 rounded-full ${
            isVerified ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {verificationLabel}
        </div>

        {/* Heart icon */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          disabled={isSaving || isUnSaving}
          className="absolute top-4 right-4 p-3"
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

      {/* Thumbnails */}
      <div className="hidden sm:flex gap-5 mt-5 overflow-x-auto">
        {[{ id: 'main', url: mainImage }, ...galleryImages].map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setCurrentImageIndex(idx)}
            className="relative w-40.75 h-25  overflow-hidden"
          >
            <Image src={img.url} alt="gallery" fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Content Layout */}
      <div className="grid md:grid-cols-3 gap-10 mt-8">
        {/* LEFT CONTENT */}
        <div className="md:col-span-2">
          <ReadMoreText
            text={description ?? 'No description available.'}
            className="text-gray-700 leading-relaxed text-sm mb-6"
            maxLength={300}
          />
          {bedrooms > 0 && (
            <p className="text-sm text-gray-700 mb-1">
              {bedrooms} bedroom{bedrooms > 1 ? 's' : ''} {type}
            </p>
          )}
          <div className="mb-6">
            <h3 className="text-2xl md:text-3xl  font-bold text-black">{price}</h3>
            <p className="text-sm text-gray-600">Agent fee: {agentFee}</p>
          </div>
          {/* Agent (Mobile position) */}
          <div className="md:hidden mb-6">
            <div className="flex items-center gap-4">
              <ProfileImage src={profileImage} alt={profileName} size="md" />
              <div>
                <p className="font-semibold text-gray-900">{profileName}</p>
                <p className="text-xs text-gray-500">Posted on {formattedDate}</p>
              </div>
            </div>

            {/* <Link href="/property/escrow" > */}
            <OrangeButton variant="orange" className="mt-4 px-6 py-2 text-sm" onClick={onChatClick}>
              CHAT
            </OrangeButton>
            {/* </Link> */}
          </div>

          {/* Engagement */}
          <div className="flex items-center gap-6 text-gray-600 text-sm mb-10">
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

          {/* Comment Section */}
          <div className="mt-12">
            <h4 className="font-semibold text-lg mb-6">Leave a Reply</h4>

            <div className="space-y-5 max-w-2xl">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Your comment here..."
                rows={7}
                className="
        w-full 
        px-4 
        py-3 
        bg-white 
        border 
        border-[#808080] 
        rounded-lg 
        resize-none
        focus:outline-none 
        focus:ring-2 
        focus:ring-[#e87722] 
        focus:border-transparent
      "
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

        {/* RIGHT SIDE AGENT CARD */}
        <div className="hidden md:flex  justify-end">
          <div className="flex items-start gap-4">
            <ProfileImage src={profileImage} alt={profileName} size="lg" />

            <div className="flex flex-col items-start">
              <p className="font-semibold text-gray-900">{profileName}</p>
              <p className="text-xs text-gray-500">Posted on {formattedDate}</p>

              {/* <Link href="/property/escrow" >   */}
              <OrangeButton
                variant="orange"
                className="mt-3 px-7 py-2 text-[12px]"
                onClick={onChatClick}
              >
                CHAT
              </OrangeButton>
              {/* </Link> */}
            </div>
          </div>
        </div>
      </div>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        id={id}
      />
    </div>
  );
}
