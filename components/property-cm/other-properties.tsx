'use client';

import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useGetAgentPropertiesById } from '@/app/apis/mutations/use-property/use-get-agents-propeties-byId';
import LoadMoreTrigger from '../load-more-trigger';
import OtherPropertiesSkeleton from './other-properties-skeleton';
import PropertyCard from './property-card';

export interface PropertyCardDetails {
  id: string;
  image: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  status?: string;
}

interface OtherPropertiesProps {
  agentName: string;
  id: string;
}

export default function OtherProperties({ agentName, id }: OtherPropertiesProps) {
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAgentPropertiesById(id);
  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.data ?? []) ?? [],
    [data?.pages],
  );

  if (isLoading) {
    return <OtherPropertiesSkeleton />;
  }
  if (error) {
    toast.error((error as Error).message);
  }

  return (
    <section className="w-full py-16">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#e87722] mb-8 sm:mb-10">
          Other properties from {agentName}
        </h2>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-3
            gap-6
            sm:gap-8
            lg:gap-10
          "
        >
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              id={property._id}
              image={property.images[0].url}
              title={property.title}
              price={property.price}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              sqft={property.size}
              status={property.status as 'For_Rent' | 'For_Sale' | 'Sold'}
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
    </section>
  );
}
