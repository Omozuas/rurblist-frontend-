'use client';

import { cn } from '@/lib/utils';

export type DocumentStatusType = 'pending' | 'submitted' | 'under_review' | 'verified' | 'rejected';

interface DocumentItem {
  label: string;
  status: DocumentStatusType;
}

interface DocumentStatusProps {
  documents: DocumentItem[];
  className?: string;
}

const statusStyles: Record<
  DocumentStatusType,
  {
    container: string;
    badge: string;
    text: string;
  }
> = {
  verified: {
    container: 'bg-[#e6f4ea]',
    badge: 'bg-[#a6e0b8] text-[#1f7a3f]',
    text: 'Verified',
  },
  submitted: {
    container: 'bg-[#f3e7db]',
    badge: 'bg-[#f6d3a8] text-[#d97706]',
    text: 'Submitted',
  },
  under_review: {
    container: 'bg-[#f3e7db]',
    badge: 'bg-[#f6d3a8] text-[#ea580c]',
    text: 'Under Review',
  },
  pending: {
    container: 'bg-[#f5f5f5]',
    badge: 'bg-[#e5e5e5] text-[#6b7280]',
    text: 'Pending',
  },
  rejected: {
    container: 'bg-[#fde8e8]',
    badge: 'bg-[#fca5a5] text-[#b91c1c]',
    text: 'Rejected',
  },
};

export default function DocumentStatus({ documents, className }: DocumentStatusProps) {
  return (
    <section className={cn('w-full px-4 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-[20px] font-semibold text-black sm:text-[24px]">Document Status</h2>

        <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          {documents.map((doc, index) => {
            const styles = statusStyles[doc.status];

            return (
              <div
                key={`${doc.label}-${index}`}
                className={cn(
                  'flex items-center justify-between rounded-2xl px-5 py-5 sm:px-7 sm:py-6 transition',
                  styles.container,
                )}
              >
                <p className="text-[15px] text-[#4a4a4a] sm:text-[17px]">{doc.label}</p>

                <span
                  className={cn(
                    'rounded-full px-4 py-1 text-[12px] font-medium sm:text-[13px]',
                    styles.badge,
                  )}
                >
                  {styles.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
