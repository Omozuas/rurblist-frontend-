'use client';

import AdvisoryServicesCard from '@/components/advisory-ui/advisory-ui';
import ExpertPropertyAdviceForm from '@/components/advisory-ui/expert-property-advice';
import { IconImage } from '@/components/icon-image/icon-image';
import { useAuth } from '@/components/layout/auth-provider';
import { useRouter } from 'next/navigation';

const ADVISORY_SERVICES = [
  'Property verification and due diligence',
  'Market analysis and pricing guidance',
  'Legal documentation review',
  'Negotiation strategy and support',
  'End-to-end deal closure assistance',
];

const PROPERTY_TYPES = [
  { label: 'House', value: 'house' },
  { label: 'Land', value: 'land' },
  { label: 'Bedsitter', value: 'bedsitter' },
  { label: 'Self contain', value: 'self_contain' },
  { label: 'Flat', value: 'flat' },
  { label: 'Boys quarters', value: 'boys_quarters' },
  { label: 'Duplex', value: 'duplex' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Mansion', value: 'mansion' },
  { label: 'Commercial', value: 'commercial' },
];

const BUDGET_RANGES = [
  { label: 'NGN 500k - NGN 1m', value: '500k-1m' },
  { label: 'NGN 1m - NGN 5m', value: '1m-5m' },
  { label: 'NGN 5m+', value: '5m-plus' },
  { label: 'NGN 10m+', value: '10m-plus' },
  { label: 'NGN 20m+', value: '20m-plus' },
  { label: 'NGN 50m+', value: '50m-plus' },
  { label: 'NGN 100m+', value: '100m-plus' },
  { label: 'NGN 200m+', value: '200m-plus' },
  { label: 'NGN 500m+', value: '500m-plus' },
  { label: 'NGN 1b+', value: '1b-plus' },
  { label: 'NGN 5b+', value: '5b-plus' },
];

const WHATSAPP_NUMBER = '2348154155124';

export default function PropertyAdvisoryPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = (data: {
    propertyType: string;
    location: string;
    budgetRange: string;
    propertyLink: string;
    files: File[];
  }) => {
    const propertyType =
      PROPERTY_TYPES.find((option) => option.value === data.propertyType)?.label ||
      data.propertyType ||
      'Not provided';
    const budgetRange =
      BUDGET_RANGES.find((option) => option.value === data.budgetRange)?.label ||
      data.budgetRange ||
      'Not provided';
    const fileNames = data.files.map((file) => file.name).join(', ');

    const message = [
      'Hello Rurblist Team, I need expert property advice.',
      '',
      `Name: ${user?.user?.fullName || 'Not provided'}`,
      `Email: ${user?.user?.email || 'Not provided'}`,
      `Phone: ${user?.user?.phoneNumber || 'Not provided'}`,
      `Property Type: ${propertyType}`,
      `Location: ${data.location || 'Not provided'}`,
      `Budget/Amount: ${budgetRange}`,
      `Property Link: ${data.propertyLink || 'Not provided'}`,
      data.files.length > 0
        ? `Selected Files: ${fileNames}. I will attach them in WhatsApp.`
        : 'Files: No files selected',
    ].join('\n');

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <>
      <header className="w-full bg-white pt-[80px]">
        <div className="relative mx-auto flex min-h-[140px] w-full max-w-6xl flex-col items-center justify-center px-5 pb-6 sm:flex-row sm:px-8">
          <div className="mb-4 flex w-full justify-start sm:hidden">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-full text-black hover:bg-gray-100"
            >
              <IconImage
                src="/icons/chevron-left.svg"
                alt="back"
                className="h-6 w-6"
                width={20}
                height={20}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-5 top-6 hidden h-9 w-9 items-center justify-center rounded-full text-black hover:bg-gray-100 sm:left-8 sm:flex"
          >
            <IconImage
              src="/icons/chevron-left.svg"
              alt="back"
              className="h-6 w-6 sm:h-7 sm:w-7"
              width={20}
              height={20}
            />
          </button>

          <div className="flex flex-col items-center text-center">
            <h1 className="text-[19px] font-semibold text-black sm:text-[22px]">
              Need help verifying or closing your next property deal?
            </h1>

            <p className="mt-2 text-[12px] text-black sm:text-[14px]">
              Get expert guidance from our property advisors who know the market inside and out.
            </p>
          </div>
        </div>
      </header>

      <div className="mb-10 space-y-8 sm:space-y-10 lg:space-y-12">
        <AdvisoryServicesCard items={ADVISORY_SERVICES} />
        <ExpertPropertyAdviceForm
          propertyTypes={PROPERTY_TYPES}
          budgetRanges={BUDGET_RANGES}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
