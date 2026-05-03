'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvisoryServicesCardProps {
  title?: string;
  items: string[];
  className?: string;
}

export default function AdvisoryServicesCard({
  title = 'Our Advisory Service Include',
  items,
  className,
}: AdvisoryServicesCardProps) {
  return (
    <section className={cn('w-full px-4 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-[#8f8f8f] bg-white px-6 py-7 sm:px-8 sm:py-8">
        <h2 className="text-[15px] font-semibold text-black sm:text-[17px]">{title}</h2>

        <div className="mt-6 space-y-4">
          {items.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-start gap-3">
              <Check
                className="mt-[1px] h-5 w-5 shrink-0 text-[#28b34b] sm:h-6 sm:w-6"
                strokeWidth={2.4}
              />

              <p className="text-[13px] leading-relaxed text-black sm:text-[15px]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
