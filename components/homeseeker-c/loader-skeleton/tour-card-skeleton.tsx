'use client';

export default function TourCardSkeleton() {
  return (
    <div className="border rounded-lg p-5 bg-white space-y-3 animate-pulse">
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
      <div className="h-4 w-2/3 bg-gray-200 rounded" />
      <div className="h-4 w-1/3 bg-gray-200 rounded" />

      <div className="pt-3">
        <div className="h-10 w-full bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
