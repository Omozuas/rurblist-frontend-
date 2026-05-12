'use client';

import LoadMoreTrigger from '../load-more-trigger';

type VerificationCard = {
  id: string;
  propertyTitle: string;
  status: string;
  stage: string;
  date?: string;
};

type PropertyVerificationsSectionProps = {
  verifications: VerificationCard[];
  onOpen: (id: string) => void;
  hasNextPage?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
};

export default function PropertyVerificationsSection({
  verifications,
  onOpen,
  hasNextPage,
  isFetchingMore,
  onLoadMore,
}: PropertyVerificationsSectionProps) {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold text-[#7a3b0c] sm:text-2xl">
        Property Verifications
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {verifications.map((verification) => (
          <button
            key={verification.id}
            type="button"
            onClick={() => onOpen(verification.id)}
            className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-[#e87722] hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-gray-950">{verification.propertyTitle}</h3>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium capitalize text-[#e87722]">
                {verification.status}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-600">{verification.stage}</p>
            <p className="mt-4 text-xs font-medium text-gray-400">
              Updated {formatDisplayDate(verification.date)}
            </p>
          </button>
        ))}
      </div>

      {verifications.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
          No property verifications yet.
        </div>
      )}

      <LoadMoreTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingMore}
        onLoadMore={onLoadMore}
        showNoMore={verifications.length > 0}
      />
    </section>
  );
}

function formatDisplayDate(date?: string) {
  if (!date) return 'Not available';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate);
}
