'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchProperties } from '@/app/apis/mutations/use-property/use-search-properties';
import { PropertyModel } from '@/app/apis/models/property-model';
import { useAuth } from '@/components/layout/auth-provider';
import {
  BedsBathsFilter,
  ForSaleFilter,
  PriceFilter,
  TypeFilter,
} from '@/components/dropdown/filter-dropdown';
import LoadMoreSkeleton from '@/components/property-cm/load-more-skeleton';
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
  const user = useAuth();
  const redirect = useRouter();

  const searchParams = useMemo(() => {
    return {
      search: searchQuery || undefined,
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
  }, [searchQuery, selectedType, selectedCategory, selectedState, minPrice, maxPrice, beds, baths]);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useSearchProperties(searchParams);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '300px',
        threshold: 0,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  if (isLoading && properties.length === 0) {
    return <PropertiesPageSkeleton />;
  }

  const currentUser = user.user;
  const savedList =
    currentUser?.agent?.savedProperties ?? currentUser?.homeSeeker?.savedProperties ?? [];

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
          onLearnMore={() => console.log('Learn more clicked')}
        />

        <div className="space-y-6">
          {properties.map((idx) => {
            const statusLabel = STATUS_MAP[idx.status] || idx.status;
            const city = idx.location.city.replace(/"/g, '');
            const state = idx.location.state.replace(/"/g, '');
            const images = idx.images || [];
            const mainImage = images.length > 0 ? images[0].url : '/image/image7.jpg';
            const galleryImages = images.slice(1).map((img) => ({
              id: img._id,
              url: img.url,
            }));

            return (
              <PropertyCard
                key={idx._id}
                id={idx._id}
                listLike={idx.likes}
                listunlike={idx.unlikes}
                likeCount={idx.likesCount}
                commentCount={idx.commentsCount}
                unlikeCount={idx.unlikesCount}
                agentFee={`NGN ${idx.agentFee.toLocaleString()}`}
                savedList={savedList}
                verificationStatus={idx.verificationStatus}
                title={`${statusLabel} - ${idx.title}, ${city} ${state} state.`}
                mainImage={mainImage}
                currentUserId={user.user?.user._id ?? ''}
                galleryImages={galleryImages}
                description={idx.description}
                price={`NGN ${idx.price.toLocaleString()}`}
                bedrooms={idx.bedrooms}
                bathrooms={idx.bathrooms}
                profileImage={
                  idx.owner?.selfieUrl?.url ||
                  idx.owner?.user?.profileImage.url ||
                  '/image/profile-img.png'
                }
                profileName={
                  `${idx.owner?.firstName ?? ''} ${idx.owner?.lastName ?? ''}`.trim() ||
                  `${idx.owner?.user.fullName}` ||
                  'Unknown'
                }
                createdAt={idx.createdAt}
                onChatClick={() => {
                  redirect.push(`/agent/profile/${idx.owner?.user._id}`);
                }}
              />
            );
          })}
        </div>
        <div ref={loadMoreRef} className="mt-6 flex min-h-12 w-full items-center justify-center">
          {isFetchingNextPage && <LoadMoreSkeleton />}
          {hasNextPage && !isFetchingNextPage && (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              className="rounded-md border border-[#e87722] px-4 py-2 text-sm font-medium text-[#e87722] transition hover:bg-orange-50"
            >
              Load more
            </button>
          )}
          {!hasNextPage && <p className="py-6 text-center text-gray-500">No more results</p>}
        </div>
      </div>
    </div>
  );
}
