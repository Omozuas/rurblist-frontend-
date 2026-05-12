'use client';

import LoadMoreTrigger from '@/components/load-more-trigger';
import PropertyCard from '@/components/property-cm/property-card';

interface Property {
  _id: string;
  title: string;
  price: number;
  status: 'For_Rent' | 'For_Sale' | 'Sold';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
}

interface Props {
  agentName: string;
  properties: Property[];
  hasNextPage?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
}

export default function AgentPropertiesSection({
  agentName,
  properties,
  hasNextPage,
  isFetchingMore,
  onLoadMore,
}: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-[#7A3E0A] mb-6">
        Properties from {agentName}
      </h2>

      {/* Grid */}
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-2 
          gap-6 sm:gap-8
        "
      >
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            id={property._id}
            title={property.title}
            price={property.price}
            status={property.status}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            sqft={property.sqft}
            image={property.image}
          />
        ))}
      </div>
      {properties.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
          No properties found.
        </div>
      )}

      <LoadMoreTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingMore}
        onLoadMore={onLoadMore}
        showNoMore={properties.length > 0}
      />
    </div>
  );
}
