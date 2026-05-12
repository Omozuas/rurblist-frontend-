'use client';

import LoadMoreTrigger from '../load-more-trigger';
import PropertyCard from '../property-cm/property-card';

interface Property {
  id: string;
  title: string;
  price: number;
  status: 'For_Rent' | 'For_Sale' | 'Sold';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
}

interface SavedPropertiesSectionProps {
  properties: Property[];
  onRemove?: (id?: string) => void;
  removingId?: string; // optional for loading state later
  hasNextPage?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
}

export default function SavedPropertiesSection({
  properties,
  onRemove,
  hasNextPage,
  isFetchingMore,
  onLoadMore,
}: SavedPropertiesSectionProps) {
  return (
    <div className="space-y-5">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-[#7a3b0c]">Saved Properties</h2>

      {/* Grid */}
      <div
        className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-2
          xl:grid-cols-3
        "
      >
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            price={property.price}
            status={property.status}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            sqft={property.sqft}
            image={property.image}
            showRemoveButton // ✅ from previous step
            onRemove={onRemove}
          />
        ))}
      </div>
      {properties.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
          No properties saved.
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
