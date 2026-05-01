'use client';

export default function HouseSeekerBasicInfoSkeleton() {
  return (
    <div className="border rounded-xl p-6 flex items-center gap-6 bg-white animate-pulse">
      {/* Image */}
      <div className="w-24 h-24 rounded-lg bg-gray-200" />

      {/* Text */}
      <div className="space-y-3 w-full">
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
