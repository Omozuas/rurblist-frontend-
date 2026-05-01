'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CurrentStatusCardProps {
  title: string;
  description: string;
  estimate?: string;
  iconSrc?: string;
  className?: string;
}

export default function CurrentStatusCard({
  title,
  description,
  estimate,
  iconSrc = '/icons/document-review.svg',
  className,
}: CurrentStatusCardProps) {
  return (
    <section className={cn('w-full px-4 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-[22px] font-semibold text-black sm:text-[26px]">Current Status</h2>

        <div className="mt-9 flex w-full flex-col items-start gap-5 rounded-2xl border border-[#ff9f43] bg-[#fff0d8] px-6 py-8 sm:flex-row sm:items-center sm:gap-12 sm:px-28 sm:py-10">
          <div className="relative h-[58px] w-[58px] shrink-0">
            <Image src={iconSrc} alt={title} fill className="object-contain" />
          </div>

          <div>
            <h3 className="text-[18px] font-medium text-[#bd4b00] sm:text-[22px]">{title}</h3>

            <p className="mt-1 text-[15px] text-[#9a4a14] sm:text-[17px]">{description}</p>

            {estimate && (
              <p className="mt-1 text-[15px] text-[#ff5a00] sm:text-[17px]">{estimate}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
