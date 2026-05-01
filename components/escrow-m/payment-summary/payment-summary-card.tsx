'use client';

import { IconImage } from '@/components/icon-image/icon-image';
import { cn } from '@/lib/utils';

interface PaymentSummaryCardProps {
  title: string;
  amount: number;
  icon: string;
  className?: string;
}

export function PaymentSummaryCard({ title, amount, icon, className }: PaymentSummaryCardProps) {
  return (
    <div
      className={cn(
        'w-full min-w-0 rounded-xl border border-gray-200 bg-white p-5',
        'flex flex-col gap-4',
        className,
      )}
    >
      {/* Top Row */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-orange-50">
          <IconImage src={icon} alt={title} width={18} height={18} />
        </div>
        <p className="text-sm text-gray-600 font-medium wrap-break-word">{title}</p>
      </div>

      {/* Amount */}
      <p className="min-w-0 text-xl md:text-2xl font-semibold text-gray-900 break-all leading-tight">
        ₦{amount.toLocaleString()}
      </p>
    </div>
  );
}
