'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useLayoutStore } from '@/store/layout-store';
import BackNavbar from '@/components/agent-c/back-navbar';
import HomeSeekerBasicInfoCard from '@/components/homeseeker-c/homeseeker-basicInfo-card';
import { useAuth } from '@/components/layout/auth-provider';
import HomeSeekerBasicInfoSkeleton from '@/components/homeseeker-c/loader-skeleton/home-seeker-basicInfo-skeleton';
import { useGetSavedProperties } from '@/app/apis/mutations/use-user/use-get-saved-property';
import { useSaveProperty } from '@/app/apis/mutations/use-property/use-save-unsave-property';
import SavedPropertiesSkeleton from '@/components/homeseeker-c/loader-skeleton/save-property-skeleton';
import { useGetTourUsers } from '@/app/apis/mutations/use-tour/use-get-tour-user';
import TourCardSkeleton from '@/components/homeseeker-c/loader-skeleton/tour-card-skeleton';
import { formatTourDate } from '@/app/apis/utils/format-tour-date';
import { useCancelTour } from '@/app/apis/mutations/use-tour/use-cancel-tour';
import { useGetVerifications } from '@/app/apis/mutations/use-verification/use-get-verifications-me';
import PropertyVerificationsSkeleton from '@/components/homeseeker-c/loader-skeleton/property-verifications-skeleton';
import { getLocalPropertyState, setLocalPropertyState } from '@/app/apis/utils/property-local-state';
import { useDeferredReady } from '@/app/apis/hooks/use-deferred-ready';

const UpcomingToursSection = dynamic(
  () => import('@/components/homeseeker-c/upcoming-tours-section'),
  { loading: () => <TourCardSkeleton /> },
);

const PropertyVerificationsSection = dynamic(
  () => import('@/components/homeseeker-c/property-verifications-section'),
  { loading: () => <PropertyVerificationsSkeleton /> },
);

const SavedPropertiesSection = dynamic(() => import('@/components/homeseeker-c/save-properties'), {
  loading: () => <SavedPropertiesSkeleton />,
});

export default function HouseSeekerProfilePage() {
  const setHideNavbar = useLayoutStore((s) => s.setHideNavbar);
  const router = useRouter();
  const deferredReady = useDeferredReady(250);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [removedSavedIds, setRemovedSavedIds] = useState<string[]>([]);
  const { user: dataInfo, isLoading } = useAuth();
  const {
    data: tour,
    isLoading: isFetching,
    fetchNextPage: fetchMoreTours,
    hasNextPage: hasNextToursPage,
    isFetchingNextPage: isFetchingMoreTours,
  } = useGetTourUsers(deferredReady);
  const {
    data: savedPropertiesData,
    isLoading: isSavedPropertiesLoading,
    fetchNextPage: fetchMoreSavedProperties,
    hasNextPage: hasNextSavedPropertiesPage,
    isFetchingNextPage: isFetchingMoreSavedProperties,
  } = useGetSavedProperties(deferredReady);
  const {
    data: verificationsData,
    isLoading: isVerificationsLoading,
    fetchNextPage: fetchMoreVerifications,
    hasNextPage: hasNextVerificationsPage,
    isFetchingNextPage: isFetchingMoreVerifications,
  } = useGetVerifications(deferredReady);
  const { unsave } = useSaveProperty();
  const { mutate: cancelTour } = useCancelTour();
  const userData = dataInfo?.user;
  const currentUserId = userData?._id;
  const savedProperties = useMemo(
    () => savedPropertiesData?.pages.flatMap((page) => page.data ?? []) ?? [],
    [savedPropertiesData?.pages],
  );

  const tours = useMemo(
    () =>
      tour?.pages.flatMap((page) => page.data ?? []).map((t) => ({
        id: t._id,
        propertyTitle: t.property?.title || 'No property',
        agentName: t.agent?.user?.fullName || 'No agent',
        dateTime: formatTourDate(t.date),
        status: t.status,
        message: t.note,
        tourType:
          t.tourType === 'call'
            ? 'Virtual Tour'
            : t.tourType === 'inspection'
              ? 'Inspection'
            : 'In-Person Tour',
      })) ?? [],
    [tour?.pages],
  );
  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const locallyUnsavedIds = savedProperties
        .filter((property) => getLocalPropertyState(property._id, currentUserId)?.isSaved === false)
        .map((property) => property._id);

      setRemovedSavedIds(locallyUnsavedIds);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [currentUserId, savedProperties]);

  const handleCancel = useCallback((id: string) => {
    if (loadingId === id) return;
    setLoadingId(id);

    cancelTour(id, {
      onSettled: () => {
        setLoadingId(null);
      },
    });
  }, [cancelTour, loadingId]);

  const listings = useMemo(
    () =>
      savedProperties
        .filter((property) => !removedSavedIds.includes(property._id))
        .map((property) => ({
          id: property._id,
          title: property.title,
          price: property.price,
          status: property.status as 'For_Rent' | 'For_Sale' | 'Sold',
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sqft: property.size,
          image: property.images?.[0]?.url || '/image/image1.jpg',
        })),
    [removedSavedIds, savedProperties],
  );

  const verifications = useMemo(
    () =>
      verificationsData?.pages.flatMap((page) => page.data ?? []).map((verification) => ({
        id: verification._id,
        propertyTitle: verification.property?.title || 'Property',
        status: verification.status || 'pending',
        stage: verification.currentStage?.title || 'Verification in progress',
        date: verification.updatedAt || verification.createdAt,
      })) ?? [],
    [verificationsData?.pages],
  );

  const handleRemove = useCallback((id?: string) => {
    if (!id) return;

    const previousIds = removedSavedIds;
    const nextIds = Array.from(new Set([...removedSavedIds, id]));

    setRemovedSavedIds(nextIds);
    setLocalPropertyState(id, currentUserId, { isSaved: false });

    unsave(id, {
      onError: (error) => {
        console.error(error);
        setRemovedSavedIds(previousIds);
        setLocalPropertyState(id, currentUserId, { isSaved: true });
      },
    });
  }, [currentUserId, removedSavedIds, unsave]);

  const handleOpenVerification = useCallback(
    (verificationId: string) => {
      router.push(`/verification?id=${verificationId}`);
    },
    [router],
  );

  return (
    <div>
      <BackNavbar logoSrc="/Rublist.svg" />
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Basic Info */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#7a3b0c]">Basic Info</h2>
          {isLoading ? (
            <HomeSeekerBasicInfoSkeleton />
          ) : (
            <HomeSeekerBasicInfoCard
              name={userData?.fullName || 'no name'}
              email={userData?.email || 'no email'}
              phone={userData?.phoneNumber || 'no phone'}
              image={userData?.profileImage.url || '/image/profile-image2.jpg'}
              address={`${userData?.roles[0] || 'No address added'}`}
            />
          )}
        </div>
        {/* Tours */}
        {!deferredReady || isFetching ? (
          <TourCardSkeleton />
        ) : (
          <UpcomingToursSection
            tours={tours}
            onCancelTour={handleCancel}
            loadingId={loadingId ?? undefined}
            hasNextPage={hasNextToursPage}
            isFetchingMore={isFetchingMoreTours}
            onLoadMore={() => fetchMoreTours()}
          />
        )}
        {!deferredReady || isVerificationsLoading ? (
          <PropertyVerificationsSkeleton />
        ) : (
          <PropertyVerificationsSection
            verifications={verifications}
            onOpen={handleOpenVerification}
            hasNextPage={hasNextVerificationsPage}
            isFetchingMore={isFetchingMoreVerifications}
            onLoadMore={() => fetchMoreVerifications()}
          />
        )}
        {!deferredReady || isSavedPropertiesLoading ? (
          <SavedPropertiesSkeleton />
        ) : (
          <SavedPropertiesSection
            properties={listings}
            onRemove={handleRemove}
            hasNextPage={hasNextSavedPropertiesPage}
            isFetchingMore={isFetchingMoreSavedProperties}
            onLoadMore={() => fetchMoreSavedProperties()}
          />
        )}
      </div>
    </div>
  );
}
