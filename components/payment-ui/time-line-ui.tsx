'use client';

import { OrangeButton } from '@/components/button/button';
import { cn } from '@/lib/utils';

export type TimelineItem = {
  label: string;
  date: string;
  highlight?: boolean;
};

interface TransactionTimelineProps {
  items: TimelineItem[];
  onStartNewTransaction?: () => void;
  buttonText?: string;
  className?: string;
}

export default function TransactionTimeline({
  items,
  onStartNewTransaction,
  buttonText = 'Start New Transaction',
  className,
}: TransactionTimelineProps) {
  return (
    <section className={cn('w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8', className)}>
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-2xl border border-[#D9D9D9] bg-[#EFEFEF] px-5 py-8 sm:px-10 sm:py-10 lg:px-[52px] lg:py-12">
          <h2 className="text-[18px] font-semibold leading-tight text-black sm:text-[22px] lg:text-[24px]">
            Transaction Timeline
          </h2>

          <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6 lg:mt-14">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
              >
                <p
                  className={cn(
                    'text-[14px] leading-tight text-black sm:text-[16px] lg:text-[19px]',
                    item.highlight && 'font-semibold text-[#18b95f]',
                  )}
                >
                  {item.label}:
                </p>

                <p
                  className={cn(
                    'text-[14px] leading-tight text-black sm:text-right sm:text-[16px] lg:text-[19px]',
                    item.highlight && 'font-semibold text-[#18b95f]',
                  )}
                >
                  {item.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-[720px] sm:mt-14 lg:mt-20">
          <OrangeButton
            fullWidth
            onClick={onStartNewTransaction}
            className="min-h-[52px] rounded-md text-[15px] font-medium sm:min-h-[56px] sm:text-[18px] lg:min-h-[58px] lg:text-[20px]"
          >
            {buttonText}
          </OrangeButton>
        </div>
      </div>
    </section>
  );
}
