"use client";

import Image from "next/image";
import { memo } from "react";
import { optimizeCloudinaryImage } from "@/app/apis/utils/cloudinary";

type Props = {
  name?: string;
  image?: string;
};

const colors = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-purple-400",
  "bg-orange-400",
  "bg-pink-400",
];

function getInitials(name?: string) {
  if (!name) return "U";

  const parts = name.split(" ");

  if (parts.length === 1) return parts[0][0];

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function UserAvatar({ name, image }: Props) {
  const color = colors[(name?.length ?? 0) % colors.length];
  const optimizedImage = optimizeCloudinaryImage(image, { width: 96 });

  if (optimizedImage) {
    return (
      <Image
        src={optimizedImage}
        alt="profile"
        width={45}
        height={45}
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className={`h-12 w-12 shrink-0 rounded-full ${color} flex items-center justify-center text-white font-semibold cursor-pointer`}
    >
      {getInitials(name)}
    </div>
  );
}

export default memo(UserAvatar);
