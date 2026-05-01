'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLayoutStore } from '@/store/layout-store';
import BackNavbar from '@/components/agent-c/back-navbar';
import HomeSeekerBasicInfoCard from '@/components/homeseeker-c/homeseeker-basicInfo-card';
import UpcomingToursSection from '@/components/homeseeker-c/upcoming-tours-section';
import SavedPropertiesSection from '@/components/homeseeker-c/save-properties';
import { useGetCurrentUser } from '@/app/apis/mutations/use-user/use-get-current-user';
import HomeSeekerBasicInfoSkeleton from '@/components/homeseeker-c/loader-skeleton/home-seeker-basicInfo-skeleton';
import { useGetSavedProperties } from '@/app/apis/mutations/use-user/use-get-saved-property';
import { useSaveProperty } from '@/app/apis/mutations/use-property/use-save-unsave-property';
import SavedPropertiesSkeleton from '@/components/homeseeker-c/loader-skeleton/save-property-skeleton';
import { useGetTourUsers } from '@/app/apis/mutations/use-tour/use-get-tour-user';
import TourCardSkeleton from '@/components/homeseeker-c/loader-skeleton/tour-card-skeleton';
import { formatTourDate } from '@/app/apis/utils/format-tour-date';
import { useCancelTour } from '@/app/apis/mutations/use-tour/use-cancel-tour';
import { useGetVerifications } from '@/app/apis/mutations/use-verification/use-get-verifications-me';
import PropertyVerificationsSection from '@/components/homeseeker-c/property-verifications-section';
import PropertyVerificationsSkeleton from '@/components/homeseeker-c/loader-skeleton/property-verifications-skeleton';

export default function HouseSeekerProfilePage() {
  const setHideNavbar = useLayoutStore((s) => s.setHideNavbar);
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { data, isLoading } = useGetCurrentUser();
  const { data: tour, isLoading: isFetching } = useGetTourUsers();
  const { data: savedPropertiesData, isLoading: isSavedPropertiesLoading } =
    useGetSavedProperties();
  const { data: verificationsData, isLoading: isVerificationsLoading } =
    useGetVerifications();
  const { unsave } = useSaveProperty();
  const { mutate: cancelTour } = useCancelTour();

  const tours =
    tour?.data?.map((t) => ({
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
    })) ?? [];
  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);

  const handleCancel = (id: string) => {
    if (loadingId === id) return;
    setLoadingId(id);

    cancelTour(id, {
      onSettled: () => {
        setLoadingId(null);
      },
    });
  };
  const listings = (savedPropertiesData?.data ?? []).map((property) => ({
    id: property._id,
    title: property.title,
    price: property.price,
    status: property.status as 'For_Rent' | 'For_Sale' | 'Sold',
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.size,
    image: property.images?.[0]?.url || '/image/image1.jpg',
  }));
  const verifications =
    verificationsData?.data?.map((verification) => ({
      id: verification._id,
      propertyTitle: verification.property?.title || 'Property',
      status: verification.status || 'pending',
      stage: verification.currentStage?.title || 'Verification in progress',
      date: verification.updatedAt || verification.createdAt,
    })) ?? [];

  const handleRemove = async (id?: string) => {
    if (!id) return;

    try {
      unsave(id); // ✅ call backend
    } catch (error) {
      console.error(error);
    }
  };

  const dataInfo = data?.data;
  const userData = dataInfo?.user;

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
        {isFetching ? (
          <TourCardSkeleton />
        ) : (
          <UpcomingToursSection
            tours={tours}
            onCancelTour={handleCancel}
            loadingId={loadingId ?? undefined}
          />
        )}
        {isVerificationsLoading ? (
          <PropertyVerificationsSkeleton />
        ) : (
          <PropertyVerificationsSection
            verifications={verifications}
            onOpen={(verificationId) => router.push(`/verification?id=${verificationId}`)}
          />
        )}
        {isSavedPropertiesLoading ? (
          <SavedPropertiesSkeleton />
        ) : (
          <SavedPropertiesSection properties={listings} onRemove={handleRemove} />
        )}
      </div>
    </div>
  );
}
