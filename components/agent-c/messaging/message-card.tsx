'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { optimizeCloudinaryImage } from '@/app/apis/utils/cloudinary';
import { TourModel2 } from '@/app/apis/models/tour-model';
import { formatTourDate } from '@/app/apis/utils/format-tour-date';

const ConfirmTourModal = dynamic(() => import('../modal/confirm-tour-modal'), {
  ssr: false,
});

interface MessageCardProps {
  name: string;
  message: string;
  date: string;
  property: string;
  timestamp: string;
  avatar?: string;
  tour: TourModel2;
  id: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  return parts
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export default function MessageCard({
  name,
  message,
  date,
  property,
  timestamp,
  avatar,
  tour,
}: MessageCardProps) {
  const [openModal, setOpenModal] = useState(false);
  const optimizedAvatar = optimizeCloudinaryImage(avatar, { width: 96 });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 transition hover:shadow-md">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-sm font-semibold text-gray-700">
          {optimizedAvatar ? (
            <Image
              src={optimizedAvatar}
              alt={name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            getInitials(name)
          )}
        </div>

        <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{name}</h3>
      </div>

      {/* Message Info */}
      <div className="text-sm sm:text-base text-gray-700 space-y-1">
        <p>{message}</p>
        <p>{date}</p>
        <p>Property: {property}</p>
      </div>

      {/* Time */}
      <p className="text-xs text-gray-500 mt-4">{timestamp}</p>

      {/* Reply */}
      <button
        onClick={() => setOpenModal(true)}
        className="mt-3 text-[#9b4b17] font-medium hover:underline"
      >
        Reply
      </button>
      {openModal && (
        <ConfirmTourModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          property={property}
          requester={name}
          requestedDate={formatTourDate(tour.date)}
          tourType={`${tour.tourType === 'call' ? 'Virtual' : tour.tourType === 'in-person' ? 'In-person' : 'Inspection'} Tour`}
          tour={tour}
        />
      )}
    </div>
  );
}
