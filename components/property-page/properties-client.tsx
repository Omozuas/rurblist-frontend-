'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebouncedValue } from '@/app/apis/hooks/use-debounced-value';
import { useSearchProperties } from '@/app/apis/mutations/use-property/use-search-properties';
import { PropertyModel } from '@/app/apis/models/property-model';
import { useAuth } from '@/components/layout/auth-provider';
import {
  BedsBathsFilter,
  ForSaleFilter,
  PriceFilter,
  TypeFilter,
} from '@/components/dropdown/filter-dropdown';
import LoadMoreTrigger from '@/components/load-more-trigger';
import PropertiesPageSkeleton from '@/components/property-cm/properties-page-skeleton';
import PropertyBanner from '@/components/property-details/property-banner';
import PropertyCard from '@/components/property-details/property-card';
import SearchBar from '@/components/search-bar/search-bar2';

interface PropertiesClientProps {
  initialSearch: string;
  initialState: string;
  initialStatus: string;
  initialType: string;
}

const STATUS_MAP: Record<string, string> = {
  For_Sale: 'For Sale',
  For_Rent: 'For Rent',
  Sold: 'Sold',
};

export default function PropertiesClient({
  initialSearch,
  initialState,
  initialStatus,
  initialType,
}: PropertiesClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState(initialStatus);
  const selectedState = initialState;
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [selectedCategory, setSelectedCategory] = useState(initialType);
  const [beds, setBeds] = useState<number | undefined>();
  const [baths, setBaths] = useState<number | undefined>();
  const { user: currentUser } = useAuth();
  const redirect = useRouter();
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 450);

  const searchParams = useMemo(() => {
    return {
      search: debouncedSearchQuery || undefined,
      status:
        selectedType === 'For_Sale'
          ? 'For_Sale'
          : selectedType === 'For_Rent'
            ? 'For_Rent'
            : selectedType === 'Sold'
              ? 'Sold'
              : undefined,
      type: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined,
      state: selectedState || undefined,
      minPrice,
      maxPrice,
      bedrooms: beds,
      bathrooms: baths,
      limit: 10,
      sort: '-createdAt',
    };
  }, [
    debouncedSearchQuery,
    selectedType,
    selectedCategory,
    selectedState,
    minPrice,
    maxPrice,
    beds,
    baths,
  ]);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useSearchProperties(searchParams);

  const properties = useMemo(() => {
    const uniqueProperties = new Map<string, PropertyModel>();

    data?.pages.forEach((page) => {
      page.data?.forEach((property) => {
        if (!uniqueProperties.has(property._id)) {
          uniqueProperties.set(property._id, property);
        }
      });
    });

    return Array.from(uniqueProperties.values());
  }, [data]);

  const currentUserId = currentUser?.user._id ?? '';

  const savedList = useMemo(
    () => currentUser?.agent?.savedProperties ?? currentUser?.homeSeeker?.savedProperties ?? [],
    [currentUser],
  );

  const handleOpenAgentProfile = useCallback(
    (ownerUserId?: string) => {
      if (!ownerUserId) return;
      redirect.push(`/agent/profile/${ownerUserId}`);
    },
    [redirect],
  );

  const propertyCards = useMemo(
    () =>
      properties.map((idx) => {
        const statusLabel = STATUS_MAP[idx.status] || idx.status;
        const city = idx.location.city.replace(/"/g, '');
        const state = idx.location.state.replace(/"/g, '');
        const images = idx.images || [];
        const mainImage = images.length > 0 ? images[0].url : '/image/image7.jpg';
        const galleryImages = images.slice(1).map((img) => ({
          id: img._id,
          url: img.url,
        }));

        return {
          id: idx._id,
          listLike: idx.likes,
          listunlike: idx.unlikes,
          likeCount: idx.likesCount,
          commentCount: idx.commentsCount,
          unlikeCount: idx.unlikesCount,
          agentFee: `NGN ${idx.agentFee.toLocaleString()}`,
          savedList,
          verificationStatus: idx.verificationStatus,
          title: `${statusLabel} - ${idx.title}, ${city} ${state} state.`,
          mainImage,
          currentUserId,
          galleryImages,
          description: idx.description,
          price: `NGN ${idx.price.toLocaleString()}`,
          bedrooms: idx.bedrooms,
          bathrooms: idx.bathrooms,
          profileImage:
            idx.owner?.selfieUrl?.url ||
            idx.owner?.user?.profileImage.url ||
            '/image/profile-img.png',
          profileName:
            `${idx.owner?.firstName ?? ''} ${idx.owner?.lastName ?? ''}`.trim() ||
            `${idx.owner?.user.fullName}` ||
            'Unknown',
          createdAt: idx.createdAt,
          ownerUserId: idx.owner?.user._id,
        };
      }),
    [currentUserId, properties, savedList],
  );

  if (isLoading && properties.length === 0) {
    return <PropertiesPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white px-6 py-4 pt-18">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-3">
              <SearchBar
                placeholder="Search..."
                value={searchQuery}
                className="w-full md:w-96"
                onChange={setSearchQuery}
              />
              <ForSaleFilter value={selectedType} onChange={setSelectedType} />

              <PriceFilter
                onApply={(min, max) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
              />

              <TypeFilter value={selectedCategory} onChange={setSelectedCategory} />
              <BedsBathsFilter
                onApply={(beds, baths) => {
                  setBeds(beds);
                  setBaths(baths);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <PropertyBanner
          title="Buy Properties Safely!"
          description="With Rurblist Account, your money is secured while we ensure every property is verified"
          imageUrl="/image/banner-img.svg"
          onLearnMore={() => redirect.push('/property-advisory')}
        />

        <div className="space-y-6">
          {propertyCards.map(({ ownerUserId, ...property }) => (
            <PropertyCard
              key={property.id}
              {...property}
              onChatClick={() => handleOpenAgentProfile(ownerUserId)}
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
    </div>
  );
}
