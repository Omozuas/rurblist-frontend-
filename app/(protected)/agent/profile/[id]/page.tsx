'use client';

import { useEffect, useMemo } from 'react';
import { useLayoutStore } from '@/store/layout-store';
import BackNavbar from '@/components/agent-c/back-navbar';
import AgentInfoSection from '@/components/agent-c/profile/agent-info';
import AgentPropertiesSection from '@/components/agent-c/profile/other-property-agent';
import RatingsSection from '@/components/agent-c/profile/rating-reviews-agent';
import { useGetAgentById } from '@/app/apis/mutations/use-agent/get-agent-by-id';
import { useParams } from 'next/navigation';
import AgentInfoSectionSkeleton from '@/components/agent-c/agent-info-section-skeleton';
import { useGetAgentPropertiesById } from '@/app/apis/mutations/use-property/use-get-agents-propeties-byId';
import CurrentListingsSectionSkeleton from '@/components/agent-c/current-listings-section-skeleton';

export default function AgentProfilePage() {
  const setHideNavbar = useLayoutStore((state) => state.setHideNavbar);
  // const { user, isLoading } = useAuth();
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useGetAgentById(id);
  const {
    data: propertiesData,
    isLoading: isPropertiesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAgentPropertiesById(id);

  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);

  const agentData = data?.data;
  const currentAgent = agentData?.user;
  const properties = useMemo(
    () => propertiesData?.pages.flatMap((page) => page.data ?? []) ?? [],
    [propertiesData?.pages],
  );
  const agent = {
    name:
      [agentData?.firstName, agentData?.lastName].filter(Boolean).join(' ') ||
      currentAgent?.fullName ||
      'Agent',
    agency: agentData?.companyName || currentAgent?.roles[0] || 'Real estate agency',
    experience: `${agentData?.yearsOfExperience ?? 0} years of experience`,
    location:
      [agentData?.city, agentData?.address].filter(Boolean).join(', ') || 'No location added',
    image:
      agentData?.selfieUrl?.url || currentAgent?.profileImage?.url || '/image/profile-image2.jpg',
    phone: currentAgent?.phoneNumber || 'No phone number added',
    email: currentAgent?.email || 'No email added',
    about:
      agentData?.description || 'Create your agent profile to add your agency details and bio.',
  };
  const listings = properties.map((property) => ({
    _id: property._id,
    title: property.title,
    price: property.price,
    status: property.status as 'For_Rent' | 'For_Sale' | 'Sold',
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.size,
    image: property.images?.[0]?.url || '/image/image1.jpg',
  }));
  return (
    <div>
      <BackNavbar logoSrc="/Rublist.svg" />
      {isLoading ? (
        <AgentInfoSectionSkeleton />
      ) : (
        <AgentInfoSection
          name={agent.name}
          agency={agent.agency}
          experience={agent.experience}
          location={agent.location}
          phone={agent.phone}
          email={agent.email}
          image={agent.image}
          about={agent.about}
          onSendMessage={async (msg) => {
            console.log(msg);
          }}
        />
      )}
      {isPropertiesLoading ? (
        <CurrentListingsSectionSkeleton />
      ) : (
        <AgentPropertiesSection
          agentName={agent.name}
          properties={listings}
          hasNextPage={hasNextPage}
          isFetchingMore={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      )}

      <RatingsSection
        averageRating={4.7}
        totalReviews={12}
        ratingBreakdown={[
          { star: 5, count: 8 },
          { star: 4, count: 3 },
          { star: 3, count: 1 },
          { star: 2, count: 0 },
          { star: 1, count: 0 },
        ]}
        reviews={[
          {
            id: '1',
            name: 'Emily',
            rating: 5,
            comment:
              'A wonderful experience from start to finish. Jane is very professional and knowledgeable.',
          },
          {
            id: '2',
            name: 'John',
            rating: 4,
            comment: 'Great service and smooth communication throughout.',
          },
          {
            id: '3',
            name: 'Sarah',
            rating: 5,
            comment: 'Highly recommend! Very professional.',
          },
          {
            id: '4',
            name: 'Joshua',
            rating: 2,
            comment:
              'A wonderful experience from start to finish. Jane is very professional and knowledgeable.',
          },
        ]}
      />
    </div>
  );
}
