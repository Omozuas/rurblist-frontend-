'use client';

import TourCardSkeleton from './tour-card-skeleton';

export default function UpcomingToursSkeleton() {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />

      {/* Horizontal scroll skeleton */}
      <div className="flex gap-4 overflow-x-auto pb-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="
              shrink-0
              w-[92%]
              sm:w-[85%]
              md:w-[60%]
              lg:w-[38%]
              xl:w-[30%]
            "
          >
            <TourCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
