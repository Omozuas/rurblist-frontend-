'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import SearchBar from '@/components/search-bar/search-bar2';
import {
  BedsBathsFilter,
  ForSaleFilter,
  PriceFilter,
  TypeFilter,
} from '@/components/dropdown/filter-dropdown';
import PropertyBanner from '@/components/property-details/property-banner';
import PropertyCard from '@/components/property-details/property-card';
import { useRouter } from 'next/navigation';
import { useSearchProperties } from '@/app/apis/mutations/use-property/use-search-properties';
import LoadMoreSkeleton from '@/components/property-cm/load-more-skeleton';
import { useAuth } from '@/components/layout/auth-provider';
import PropertiesPageSkeleton from '@/components/property-cm/properties-page-skeleton';

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('forsale');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [beds, setBeds] = useState<number | undefined>();
  const [baths, setBaths] = useState<number | undefined>();
  const user = useAuth();
  const redirect = useRouter();
  // ✅ Build backend query params
  const searchParams = useMemo(() => {
    return {
      search: searchQuery || undefined,

      // map UI → backend
      status:
        selectedType === 'For_Sale'
          ? 'For_Sale'
          : selectedType === 'For_Rent'
            ? 'For_Rent'
            : selectedType === 'Sold'
              ? 'Sold'
              : undefined,

      type: selectedCategory !== 'all' ? capitalize(selectedCategory) : undefined,

      minPrice,
      maxPrice,
      bedrooms: beds,
      bathrooms: baths,

      limit: 10,
      sort: '-price',
    };
  }, [searchQuery, selectedType, selectedCategory, minPrice, maxPrice, beds, baths]);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useSearchProperties(searchParams);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);


  const STATUS_MAP: Record<string, string> = {
    For_Sale: 'For Sale',
    For_Rent: 'For Rent',
    Sold: 'Sold',
  };
  const properties = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  if (isLoading && properties.length === 0) {
    return <PropertiesPageSkeleton />;
  }
  const currentUser = user.user;

  const savedList =
    currentUser?.agent?.savedProperties ?? currentUser?.homeSeeker?.savedProperties ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Search and Filters */}
      <div className=" bg-white px-6 py-4 border-b border-gray-200 pt-18">
        <div className="max-w-7xl mx-auto ">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Filter Dropdowns */}
            <div className="flex gap-3 flex-wrap">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Banner */}
        <PropertyBanner
          title="Buy Properties Safely!"
          description="With Rurblist Account, your money is secured while we ensure every property is verified"
          imageUrl="/image/banner-img.svg"
          onLearnMore={() => console.log('Learn more clicked')}
        />

        {/* Property Cards */}
        <div className="space-y-6">
          {properties.map((idx) => {
            const statusLabel = STATUS_MAP[idx.status] || idx.status;
            const city = idx.location.city.replace(/"/g, '');
            const state = idx.location.state.replace(/"/g, '');
            // ✅ images handling
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
                agentFee={`₦${idx.agentFee.toLocaleString()}`}
                savedList={savedList}
                verificationStatus={idx.verificationStatus}
                title={`${statusLabel} - ${idx.title}, ${city} ${state} state.`}
                mainImage={mainImage}
                currentUserId={user.user?.user._id ?? ''}
                galleryImages={galleryImages}
                description={idx.description}
                price={`₦${idx.price.toLocaleString()}`}
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
                // comments={mockComments}

                createdAt={idx.createdAt}
                onChatClick={() => {
                  redirect.push(`/agent/profile/${idx.owner?.user._id}`);
                }}
              />
            );
          })}
        </div>
        <div ref={loadMoreRef} className="w-full mt-6">
          {isFetchingNextPage && <LoadMoreSkeleton />}
          {!hasNextPage && <p className="text-center text-gray-500 py-6">No more results</p>}
        </div>
      </div>
    </div>
  );
}
// helper
function capitalize(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}
