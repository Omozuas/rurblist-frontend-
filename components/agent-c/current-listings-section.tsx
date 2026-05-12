'use client';

import { IconImage } from '@/components/icon-image/icon-image';
import { OrangeButton } from '../button/button';
import PropertyCard from '../property-cm/property-card';
import { useRouter } from 'next/navigation';

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

interface CurrentListingsSectionProps {
  properties: Property[];
  onEditProperty?: (id: string) => void;
  onDeleteProperty?: (property: Property) => void;
}

export default function CurrentListingsSection({
  properties,
  onEditProperty,
  onDeleteProperty,
}: CurrentListingsSectionProps) {
  const router = useRouter();
  return (
    <section className="mt-10 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 mb-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold font-[Georgia] text-[#363636]">
            Current listings
          </h2>

          <IconImage src="/icons/clock.svg" alt="clock" width={20} height={20} />
        </div>

        {/* Button */}
        <OrangeButton
          className="font-[Nunito] font-medium"
          iconSrc="/icons/plus-circle.svg"
          onMouseEnter={() => router.prefetch('/agent/add-property')}
          onClick={() => {
            router.push('/agent/add-property');
          }}
        >
          Add new listing
        </OrangeButton>
      </div>

      {/* Grid */}
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        gap-6
      "
      >
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            {...property}
            showControls
            onEdit={(id) => {
              if (!id) return;
              router.prefetch(`/agent/add-property?propertyId=${id}`);
              onEditProperty?.(id);
            }}
            onDelete={() => onDeleteProperty?.(property)}
          />
        ))}
      </div>
      {properties.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
          No properties found.
        </div>
      )}
    </section>
  );
}
