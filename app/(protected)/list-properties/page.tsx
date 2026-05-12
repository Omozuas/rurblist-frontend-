'use client';

import { useMemo } from 'react';
import { useGetMyProperties } from '@/app/apis/mutations/use-property/use-get-my-properties';
import LoadMoreTrigger from '@/components/load-more-trigger';
import EmptyPropertyState from '@/components/property-cm/list-pr/empty-property';
import PropertyCard from '@/components/property-cm/property-card';
import PropertySkeletonGrid from '@/components/property-cm/property-loder-grid';

export default function ListPropertiesPage() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMyProperties();

  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.data ?? []) ?? [],
    [data?.pages],
  );

  if (isLoading) {
    return <PropertySkeletonGrid />;
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        {(error as Error).message || 'Unable to load properties.'}
      </div>
    );
  }

  if (properties.length === 0) {
    return <EmptyPropertyState />;
  }

  return (
    <div className="p-4 sm:p-6">
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6
        md:gap-8
        mt-15
      "
      >
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            id={property._id}
            title={property.title}
            price={property.price}
            status={property.status as 'For_Rent' | 'For_Sale' | 'Sold'}
            bedrooms={property.bathrooms}
            bathrooms={property.bathrooms}
            sqft={property.size}
            image={property.images[5]?.url}
          />
        ))}
      </div>

      <LoadMoreTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        showNoMore={properties.length > 0}
      />
    </div>
  );
}
