'use client';

import AdvisoryServicesCard from '@/components/advisory-ui/advisory-ui';
import ExpertPropertyAdviceForm from '@/components/advisory-ui/expert-property-advice';
import { IconImage } from '@/components/icon-image/icon-image';
import { useRouter } from 'next/navigation';

const ADVISORY_SERVICES = [
  'Property verification and due diligence',
  'Market analysis and pricing guidance',
  'Legal documentation review',
  'Negotiation strategy and support',
  'End-to-end deal closure assistance',
];

export default function PropertyAdvisoryPage() {
  const router = useRouter();

  return (
    <>
      <header className="w-full bg-white  pt-[80px]">
        <div className="relative mx-auto flex min-h-[140px] w-full max-w-6xl flex-col items-center justify-center px-5 sm:flex-row sm:px-8 pb-6">
          {/* 🔙 Back button (Mobile - top) */}
          <div className="w-full sm:hidden mb-4 flex justify-start">
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

          {/* 🔙 Back button (Desktop - left side) */}
          <button
            type="button"
            onClick={() => router.back()}
            className="hidden sm:flex absolute left-5 top-6 h-9 w-9 items-center justify-center rounded-full text-black hover:bg-gray-100 sm:left-8"
          >
            <IconImage
              src="/icons/chevron-left.svg"
              alt="back"
              className="h-6 w-6 sm:h-7 sm:w-7"
              width={20}
              height={20}
            />
          </button>

          {/* ✅ Center Content */}
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
      <div className="space-y-8 sm:space-y-10 lg:space-y-12 mb-10">
        <AdvisoryServicesCard
          items={[
            'Property verification and due diligence',
            'Market analysis and pricing guidance',
            'Legal documentation review',
            'Negotiation strategy and support',
            'End-to-end deal closure assistance',
          ]}
        />
        <ExpertPropertyAdviceForm
          propertyTypes={[
            { label: 'House', value: 'house' },
            { label: 'Apartment', value: 'apartment' },
            { label: 'Land', value: 'land' },
          ]}
          budgetRanges={[
            { label: '₦500k - ₦1m', value: '500k-1m' },
            { label: '₦1m - ₦5m', value: '1m-5m' },
            { label: '₦5m+', value: '5m-plus' },
          ]}
          onSubmit={(data) => console.log(data)}
        />
      </div>
    </>
  );
}
