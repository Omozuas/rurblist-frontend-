'use client';
import { useGetPropertyById } from '@/app/apis/mutations/use-property/use-get-property-by-id';
import { optimizeCloudinaryImage } from '@/app/apis/utils/cloudinary';
import AdvancedHeroGallery, { GalleryImage } from '@/components/property-cm/advanced-hero-gallery';
import PropertyDetails from '@/components/property-cm/property-details';
import PropertyDetailSkeleton from '@/components/property-cm/property-detail-skeleton';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { OrangeButton } from '@/components/button/button';
import { useAuth } from '@/components/layout/auth-provider';

const ContactCard = dynamic(() => import('@/components/property-cm/contact-card'), {
  loading: () => <SectionSkeleton className="h-80" />,
});

const OtherProperties = dynamic(() => import('@/components/property-cm/other-properties'), {
  loading: () => <SectionSkeleton className="h-64" />,
});

const PropertyMap = dynamic(() => import('@/components/property-cm/property-map'), {
  loading: () => <SectionSkeleton className="h-100" />,
});

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, error, isLoading } = useGetPropertyById(id);
  const { user } = useAuth();
  const property = data?.data;
  const currentUserId = user?.user?._id;
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
      src: optimizeCloudinaryImage(img.url, { width: 1200 }) || img.url,
      alt: property.title,
    })) ?? [];
  const agentImage =
    optimizeCloudinaryImage(
      property?.owner.selfieUrl.url || property?.owner.user.profileImage.url || undefined,
      { width: 180 },
    ) || '/image/profile-image2.jpg';

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
              agentImage={agentImage}
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

function SectionSkeleton({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-xl border border-gray-200 bg-gray-100 ${className}`} />
  );
}
