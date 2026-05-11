'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BackNavbar from '@/components/agent-c/back-navbar';
import { AgentInfoSection } from '@/components/agent-c/agent-info-section';
import AgentInfoSectionSkeleton from '@/components/agent-c/agent-info-section-skeleton';
import CurrentListingsSection from '@/components/agent-c/current-listings-section';
import CurrentListingsSectionSkeleton from '@/components/agent-c/current-listings-section-skeleton';
import MessagesSection from '@/components/agent-c/messaging/messages-section';
import MessagesSectionSkeleton from '@/components/agent-c/messaging/messages-section-skeleton';
import TourCardSkeleton from '@/components/homeseeker-c/loader-skeleton/tour-card-skeleton';
import UpcomingToursSection from '@/components/homeseeker-c/upcoming-tours-section';
import { useGetCurrentAgent } from '@/app/apis/mutations/use-agent/get-current-agent';
import { useGetMyProperties } from '@/app/apis/mutations/use-property/use-get-my-properties';
import { useLayoutStore } from '@/store/layout-store';
import { useGetSavedProperties } from '@/app/apis/mutations/use-user/use-get-saved-property';
import { useSaveProperty } from '@/app/apis/mutations/use-property/use-save-unsave-property';
import SavedPropertiesSkeleton from '@/components/homeseeker-c/loader-skeleton/save-property-skeleton';
import SavedPropertiesSection from '@/components/homeseeker-c/save-properties';
import { useGetTourAgents } from '@/app/apis/mutations/use-tour/use-get-tour-agent';
import { useGetTourUsers } from '@/app/apis/mutations/use-tour/use-get-tour-user';
import { useCancelTour } from '@/app/apis/mutations/use-tour/use-cancel-tour';
import { formatTourDate } from '@/app/apis/utils/format-tour-date';
import { getLocalPropertyState, setLocalPropertyState } from '@/app/apis/utils/property-local-state';
import { useGetVerifications } from '@/app/apis/mutations/use-verification/use-get-verifications-me';
import PropertyVerificationsSection from '@/components/homeseeker-c/property-verifications-section';
import PropertyVerificationsSkeleton from '@/components/homeseeker-c/loader-skeleton/property-verifications-skeleton';
import { useDeleteProperty } from '@/app/apis/mutations/use-property/use-update-delete-property';
import { OrangeButton } from '@/components/button/button';

type Listing = {
  id: string;
  title: string;
  price: number;
  status: 'For_Rent' | 'For_Sale' | 'Sold';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
};

export default function AgentPrivateProfilePage() {
  const setHideNavbar = useLayoutStore((state) => state.setHideNavbar);
  const router = useRouter();
  const { data, isLoading } = useGetCurrentAgent();
  const { data: tour, isLoading: isFetching } = useGetTourAgents();
  const { data: userTours, isLoading: isUserToursFetching } = useGetTourUsers();
  const { data: propertiesData, isLoading: isPropertiesLoading } = useGetMyProperties();
  const { data: savedPropertiesData, isLoading: isSavedPropertiesLoading } =
    useGetSavedProperties();
  const { data: verificationsData, isLoading: isVerificationsLoading } = useGetVerifications();
  const { unsave } = useSaveProperty();
  const { mutate: cancelTour } = useCancelTour();
  const { mutate: deleteProperty, isPending: isDeletingProperty } = useDeleteProperty();
  const [loadingTourId, setLoadingTourId] = useState<string | null>(null);
  const [removedSavedIds, setRemovedSavedIds] = useState<string[]>([]);
  const [propertyToDelete, setPropertyToDelete] = useState<Listing | null>(null);

  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);

  const agentData = data?.data;
  const currentAgent = agentData?.user;
  const currentUserId = currentAgent?._id;
  const isAgent = agentData?.isAgreement;
  const properties = propertiesData?.data ?? [];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const locallyUnsavedIds = (savedPropertiesData?.data ?? [])
        .filter((property) => getLocalPropertyState(property._id, currentUserId)?.isSaved === false)
        .map((property) => property._id);

      setRemovedSavedIds(locallyUnsavedIds);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [currentUserId, savedPropertiesData?.data]);

  const agent = {
    name:
      currentAgent?.fullName ||
      [agentData?.firstName, agentData?.lastName].filter(Boolean).join(' ') ||
      'Agent',
    agency: agentData?.companyName || currentAgent?.roles?.[0] || 'Real estate agency',
    experience: `${agentData?.yearsOfExperience ?? 0} years of experience`,
    location:
      [agentData?.city, agentData?.address].filter(Boolean).join(', ') || 'No location added',
    image:
      currentAgent?.profileImage?.url || agentData?.selfieUrl.url || '/image/profile-image2.jpg',
    phone: currentAgent?.phoneNumber || 'No phone number added',
    email: currentAgent?.email || 'No email added',
    about:
      agentData?.description || 'Create your agent profile to add your agency details and bio.',
  };

  const listings = properties.map((property) => ({
    id: property._id,
    title: property.title,
    price: property.price,
    status: property.status as 'For_Rent' | 'For_Sale' | 'Sold',
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.size,
    image: property.images?.[0]?.url || '/image/image1.jpg',
  }));
  const saveListings = (savedPropertiesData?.data ?? [])
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
    }));

  const handleRemove = (id?: string) => {
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
  };

  const handleCancelTour = (id: string) => {
    if (loadingTourId === id) return;

    setLoadingTourId(id);
    cancelTour(id, {
      onSettled: () => {
        setLoadingTourId(null);
      },
    });
  };

  const handleDeleteProperty = () => {
    if (!propertyToDelete) return;

    deleteProperty(propertyToDelete.id, {
      onSuccess: () => {
        setPropertyToDelete(null);
      },
    });
  };
  // const messages: Array<{
  //   id: string;
  //   name: string;
  //   message: string;
  //   date: string;
  //   property: string;
  //   timestamp: string;
  //   avatar?: string;
  // }> = [];
  const messages =
    tour?.data?.map((t) => ({
      id: t._id,
      name: t.user?.fullName || 'Unknown User',
      message: `Requested Tour: ${t.tourType === 'call' ? 'Virtual' : t.tourType === 'in-person' ? 'In-person' : 'Inspection'}`,
      date: `Date & Time: ${formatTourDate(t.date)}`,
      property: ` ${t.property?.title || 'No property'}`,
      timestamp: new Date(t.createdAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      avatar: t.user?.profileImage?.url ?? t.agent?.selfieUrl?.url ?? undefined,
      tour: t,
    })) ?? [];
  const tours =
    userTours?.data?.map((t) => ({
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
  const verifications =
    verificationsData?.data?.map((verification) => ({
      id: verification._id,
      propertyTitle: verification.property?.title || 'Property',
      status: verification.status || 'pending',
      stage: verification.currentStage?.title || 'Verification in progress',
      date: verification.updatedAt || verification.createdAt,
    })) ?? [];

  return (
    <div>
      <BackNavbar logoSrc="/Rublist.svg" />
      <div className="max-w-7xl mx-auto space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <AgentInfoSectionSkeleton />
        ) : (
          <AgentInfoSection
            agent={agent}
            isCreateAgent={!isAgent}
            onActionClick={() => router.push('/agent/request')}
          />
        )}
        {isPropertiesLoading ? (
          <CurrentListingsSectionSkeleton />
        ) : (
          <CurrentListingsSection
            properties={listings}
            onEditProperty={(id) => router.push(`/agent/add-property?propertyId=${id}`)}
            onDeleteProperty={(property) => setPropertyToDelete(property)}
          />
        )}
        {isFetching ? <MessagesSectionSkeleton /> : <MessagesSection messages={messages} />}
        <div className="pt-2">
          {isUserToursFetching ? (
            <TourCardSkeleton />
          ) : (
            <UpcomingToursSection
              tours={tours}
              onCancelTour={handleCancelTour}
              loadingId={loadingTourId ?? undefined}
            />
          )}
        </div>
        <div className="pt-2">
          {isVerificationsLoading ? (
            <PropertyVerificationsSkeleton />
          ) : (
            <PropertyVerificationsSection
              verifications={verifications}
              onOpen={(verificationId) => router.push(`/verification?id=${verificationId}`)}
            />
          )}
        </div>
        {isSavedPropertiesLoading ? (
          <SavedPropertiesSkeleton />
        ) : (
          <SavedPropertiesSection properties={saveListings} onRemove={handleRemove} />
        )}
      </div>

      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="font-[Georgia] text-xl font-bold text-[#833700]">
              Delete property?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              You are about to delete {propertyToDelete.title}. This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <OrangeButton
                type="button"
                variant="white"
                fullWidth
                disabled={isDeletingProperty}
                onClick={() => setPropertyToDelete(null)}
              >
                No
              </OrangeButton>

              <OrangeButton
                type="button"
                fullWidth
                loading={isDeletingProperty}
                onClick={handleDeleteProperty}
              >
                Yes, delete
              </OrangeButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
