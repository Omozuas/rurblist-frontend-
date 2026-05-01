'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackNavbar from '@/components/agent-c/back-navbar';
import { AgentInfoSection } from '@/components/agent-c/agent-info-section';
import AgentInfoSectionSkeleton from '@/components/agent-c/agent-info-section-skeleton';
import CurrentListingsSection from '@/components/agent-c/current-listings-section';
import CurrentListingsSectionSkeleton from '@/components/agent-c/current-listings-section-skeleton';
import MessagesSection from '@/components/agent-c/messaging/messages-section';
import MessagesSectionSkeleton from '@/components/agent-c/messaging/messages-section-skeleton';
import { useGetCurrentAgent } from '@/app/apis/mutations/use-agent/get-current-agent';
import { useGetMyProperties } from '@/app/apis/mutations/use-property/use-get-my-properties';
import { useLayoutStore } from '@/store/layout-store';
import { useGetSavedProperties } from '@/app/apis/mutations/use-user/use-get-saved-property';
import { useSaveProperty } from '@/app/apis/mutations/use-property/use-save-unsave-property';
import SavedPropertiesSkeleton from '@/components/homeseeker-c/loader-skeleton/save-property-skeleton';
import SavedPropertiesSection from '@/components/homeseeker-c/save-properties';
import { useGetTourAgents } from '@/app/apis/mutations/use-tour/use-get-tour-agent';
import { formatTourDate } from '@/app/apis/utils/format-tour-date';

export default function AgentPrivateProfilePage() {
  const setHideNavbar = useLayoutStore((state) => state.setHideNavbar);
  const router = useRouter();
  const { data, isLoading } = useGetCurrentAgent();
  const { data: tour, isLoading: isFetching } = useGetTourAgents();
  const { data: propertiesData, isLoading: isPropertiesLoading } = useGetMyProperties();
  const { data: savedPropertiesData, isLoading: isSavedPropertiesLoading } =
    useGetSavedProperties();
  const { unsave } = useSaveProperty();

  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);

  const agentData = data?.data;
  const currentAgent = agentData?.user;
  const isAgent = agentData?.isAgreement;
  const properties = propertiesData?.data ?? [];

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
  const saveListings = (savedPropertiesData?.data ?? []).map((property) => ({
    id: property._id,
    title: property.title,
    price: property.price,
    status: property.status as 'For_Rent' | 'For_Sale' | 'Sold',
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.size,
    image: property.images?.[0]?.url || '/image/image1.jpg',
  }));

  const handleRemove = async (id?: string) => {
    if (!id) return;

    try {
      unsave(id); // ✅ call backend
    } catch (error) {
      console.error(error);
    }
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
  return (
    <div>
      <BackNavbar logoSrc="/Rublist.svg" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <AgentInfoSectionSkeleton />
        ) : (
          <AgentInfoSection
            agent={agent}
            isCreateAgent={!isAgent}
            onActionClick={() => {
              if (!isAgent) {
                router.push('/agent/request');
              }
            }}
          />
        )}
        {isPropertiesLoading ? (
          <CurrentListingsSectionSkeleton />
        ) : (
          <CurrentListingsSection properties={listings} />
        )}
        {isFetching ? <MessagesSectionSkeleton /> : <MessagesSection messages={messages} />}
        {isSavedPropertiesLoading ? (
          <SavedPropertiesSkeleton />
        ) : (
          <SavedPropertiesSection properties={saveListings} onRemove={handleRemove} />
        )}
      </div>
    </div>
  );
}
