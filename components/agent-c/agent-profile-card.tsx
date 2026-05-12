'use client';

import Image from 'next/image';
import { optimizeCloudinaryImage } from '@/app/apis/utils/cloudinary';

interface AgentProfileCardProps {
  name: string;
  agency: string;
  experience: string;
  location: string;
  image: string;
}

export function AgentProfileCard({
  name,
  agency,
  experience,
  location,
  image,
}: AgentProfileCardProps) {
  const optimizedImage = optimizeCloudinaryImage(image, { width: 240 });

  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#DEDEDE] bg-white p-4 sm:gap-6 sm:p-6">
      {/* Agent Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-27.5 md:h-27.5 rounded-lg overflow-hidden shrink-0">
        <Image
          src={optimizedImage || '/image/profile-image2.jpg'}
          alt={name}
          fill
          sizes="110px"
          className="object-cover"
        />
      </div>

      {/* Agent Info */}
      <div className="flex min-w-0 flex-col justify-center space-y-1">
        <h3 className="wrap-break-word text-lg font-semibold text-gray-900 sm:text-xl md:text-2xl">
          {name}
        </h3>

        <p className="wrap-break-word text-sm text-gray-600 sm:text-base">{agency}</p>

        <p className="wrap-break-word text-sm text-gray-600  sm:text-base">{experience}</p>

        <p className="wrap-break-word text-xs text-gray-500 sm:text-sm">
          Area of operation: {location}
        </p>
      </div>
    </div>
  );
}
