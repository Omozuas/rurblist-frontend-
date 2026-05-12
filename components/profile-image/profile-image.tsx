'use client';

import Image from 'next/image';
import { useState } from 'react';
import { optimizeCloudinaryImage } from '@/app/apis/utils/cloudinary';

interface ProfileImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
  role?: string;
}

const sizeMap = {
  sm: 40,
  md: 56,
  lg: 77,
};

// Generate initials (e.g. "Oluwaseun Musa" -> "OM")
function getInitials(name?: string) {
  if (!name) return 'U';

  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Generate consistent background color based on name
function getColorFromName(name?: string) {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ];

  if (!name) return colors[0];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export default function ProfileImage({ src, alt, size = 'md', name, role }: ProfileImageProps) {
  const sizeValue = sizeMap[size];
  const [imgError, setImgError] = useState(false);

  const showFallback = !src || imgError;
  const initials = getInitials(name || alt);
  const bgColor = getColorFromName(name || alt);
  const optimizedSrc = optimizeCloudinaryImage(src, { width: sizeValue * 2 });

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div
        className={`relative rounded-full overflow-hidden flex items-center justify-center text-white font-semibold ${bgColor}`}
        style={{ width: sizeValue, height: sizeValue }}
      >
        {!showFallback ? (
          <Image
            src={optimizedSrc as string}
            alt={alt}
            fill
            className="object-cover"
            sizes={`${sizeValue}px`}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-sm sm:text-base">{initials}</span>
        )}
      </div>

      {/* Name + Role */}
      {(name || role) && (
        <div>
          {name && <p className="font-semibold text-gray-900">{name}</p>}
          {role && <p className="text-xs text-[#e87722]">{role}</p>}
        </div>
      )}
    </div>
  );
}
