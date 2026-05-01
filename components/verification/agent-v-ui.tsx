'use client';

import Image from 'next/image';
import { OrangeButton } from '@/components/button/button';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  name: string;
  company: string;
  imageSrc: string;
  trustScore?: string;
  onChat?: () => void;
  onReport?: () => void;
  className?: string;
}

export default function AgentCard({
  name,
  company,
  imageSrc,
  trustScore = '4.8/5',
  onChat,
  onReport,
  className,
}: AgentCardProps) {
  return (
    <section className={cn('w-full px-4 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-[#eeeeee] px-6 py-7 sm:px-10 sm:py-8">
        <h2 className="text-[22px] font-medium text-black sm:text-[28px]">Your Agent</h2>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <div className="relative h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full sm:h-[54px] sm:w-[54px]">
              <Image src={imageSrc} alt={name} fill className="object-cover" />
            </div>

            <div>
              <h3 className="text-[17px] font-semibold leading-tight text-black sm:text-[20px]">
                {name}
              </h3>

              <p className="mt-1 text-[15px] leading-tight text-black sm:text-[17px]">{company}</p>

              <div className="mt-2 inline-flex rounded-full bg-[#ffb07a] px-4 py-1 text-[11px] font-medium text-white">
                Trust score&nbsp; {trustScore}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid w-full max-w-[680px] grid-cols-1 gap-4 sm:grid-cols-2">
          <OrangeButton fullWidth onClick={onChat} className="min-h-[44px] rounded-lg text-[13px]">
            Chat with Agent
          </OrangeButton>

          <OrangeButton
            fullWidth
            variant="white"
            onClick={onReport}
            className="min-h-[44px] rounded-lg border border-red-500 text-[13px] text-red-500 hover:bg-red-50"
          >
            Report Agent
          </OrangeButton>
        </div>
      </div>
    </section>
  );
}
