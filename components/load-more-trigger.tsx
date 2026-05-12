'use client';

import { useEffect, useRef } from 'react';
import LoadMoreSkeleton from './property-cm/load-more-skeleton';

interface LoadMoreTriggerProps {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  showNoMore?: boolean;
}

export default function LoadMoreTrigger({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  showNoMore = true,
}: LoadMoreTriggerProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const isFetchingRef = useRef(isFetchingNextPage);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    isFetchingRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || isFetchingRef.current) return;

        onLoadMoreRef.current?.();
      },
      {
        root: null,
        rootMargin: '500px',
        threshold: 0,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasNextPage]);

  return (
    <div ref={loadMoreRef} className="mt-6 flex min-h-12 w-full items-center justify-center">
      {isFetchingNextPage && <LoadMoreSkeleton />}

      {hasNextPage && !isFetchingNextPage && (
        <button
          type="button"
          onClick={onLoadMore}
          className="rounded-md border border-[#e87722] px-4 py-2 text-sm font-medium text-[#e87722] transition hover:bg-orange-50"
        >
          Load more
        </button>
      )}

      {!hasNextPage && showNoMore && (
        <p className="py-6 text-center text-gray-500">No more results</p>
      )}
    </div>
  );
}
