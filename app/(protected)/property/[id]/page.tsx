'use client';
import { useGetPropertyById } from '@/app/apis/mutations/use-property/use-get-property-by-id';
import AdvancedHeroGallery, { GalleryImage } from '@/components/property-cm/advanced-hero-gallery';
import ContactCard from '@/components/property-cm/contact-card';
import OtherProperties from '@/components/property-cm/other-properties';
import PropertyDetails from '@/components/property-cm/property-details';
import PropertyDetailSkeleton from '@/components/property-cm/property-detail-skeleton';
import PropertyMap from '@/components/property-cm/property-map';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { OrangeButton } from '@/components/button/button';
import { useGetCurrentUser } from '@/app/apis/mutations/use-user/use-get-current-user';

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, error, isLoading } = useGetPropertyById(id);
  const { data: userData } = useGetCurrentUser();
  const property = data?.data;
  const currentUserId = userData?.data?.user?._id;
  const ownerUserId = property?.owner?.user?._id;
  const isOwner = !!currentUserId && !!ownerUserId && currentUserId === ownerUserId;

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }
  if (error) {
    toast.error((error as Error).message);
  }
  /* ================= MAP API IMAGES ================= */

  const images: GalleryImage[] =
    property?.images?.map((img) => ({
      id: img._id,
      src: img.url,
      alt: property.title,
    })) ?? [];
  return (
    <div className="mt-17">
      <AdvancedHeroGallery images={images} autoPlay autoPlayInterval={4000} />
      {/* CONTENT SECTION */}
      <div className="max-w-350 mx-auto px-3 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* LEFT — Larger */}
          <div className="lg:col-span-8">
            <PropertyDetails
              price={property?.price ?? 0}
              status={property?.status as 'For_Rent' | 'For_Sale' | 'Sold'}
              verificationStatus={property?.verificationStatus}
              location={property?.location.address ?? ''}
              bedrooms={property?.bedrooms ?? 0}
              bathrooms={property?.bathrooms ?? 0}
              sqft={property?.size ?? 0}
              type={property?.type ?? ''}
              amenities={property?.amenities}
              description={property?.description ?? ''}
            />
          </div>

          {/* RIGHT — Smaller */}
          <div className="lg:col-span-4">
            <ContactCard
              agentImage={
                property?.owner.selfieUrl.url ??
                property?.owner.user.profileImage.url ??
                '/image/profile-image2.jpg'
              }
              agentName={
                `${property?.owner.firstName ?? ''} ${property?.owner.lastName ?? ''}`.trim() ||
                'June Austen'
              }
              agency={
                property?.owner.companyName ??
                property?.owner.user.roles[0] ??
                'ABX real estate agency'
              }
              propertyId={property?._id ?? ''}
              agentId={property?.owner._id ?? ''}
              inspectionFee={property?.inspectionFee}
              location={property?.location.address}
              phone={`${property?.owner.user.phoneNumber ?? '+234 902 002 000'}`}
            />
          </div>
        </div>
      </div>
      {!isOwner && (
        <OrangeButton
          variant="orange"
          className="mx-auto block w-1/2 mb-10"
          onClick={() => {
            const propertyId = property?._id ?? '';
            router.push(`/property/escrow/${propertyId}`);
          }}
        >
          Buy this property
        </OrangeButton>
      )}
      <PropertyMap
        address={property?.location.address}
        latitude={property?.location.coordinates.coordinates[1]}
        longitude={property?.location.coordinates.coordinates[0]}
        height="h-[400px]"
      />
      <OtherProperties
        agentName={
          `${property?.owner.firstName ?? ''} ${property?.owner.lastName ?? ''}`.trim() ||
          'June Austen'
        }
        id={property?.owner.user._id ?? ''}
      />
    </div>
  );
}
