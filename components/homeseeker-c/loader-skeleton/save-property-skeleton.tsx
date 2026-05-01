'use client';

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 animate-pulse">
      {/* Image */}
      <div className="w-full h-52 sm:h-60 lg:h-70 bg-gray-200 rounded-xl" />

      {/* Content */}
      <div className="mt-5 space-y-4">
        <div className="h-5 w-3/4 bg-gray-200 rounded" />

        <div className="h-8 w-1/2 bg-gray-200 rounded" />

        <div className="flex gap-4">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function SavedPropertiesSkeleton() {
  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="h-6 w-56 bg-gray-200 rounded animate-pulse" />

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
