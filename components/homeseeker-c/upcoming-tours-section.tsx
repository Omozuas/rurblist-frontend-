'use client';

import TourCard from './tour-card';

interface Tour {
  id: string;
  propertyTitle: string;
  agentName: string;
  dateTime: string;
  tourType: string;
  status: string;
  message: string;
}

interface UpcomingToursSectionProps {
  tours: Tour[];
  onCancelTour?: (id: string) => void;
  loadingId?: string;
  participantLabel?: string;
}

export default function UpcomingToursSection({
  tours,
  onCancelTour,
  loadingId,
  participantLabel,
}: UpcomingToursSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-[#7a3b0c]">Upcoming Tours</h2>

      <div className="relative">
        {/* Scroll container */}
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="
                shrink-0 snap-start
                w-[92%] 
                sm:w-[70%] 
                md:w-[60%] 
                lg:w-[42%]
              "
            >
              <TourCard
                propertyTitle={tour.propertyTitle}
                agentName={tour.agentName}
                participantLabel={participantLabel}
                dateTime={tour.dateTime}
                tourType={tour.tourType}
                loading={loadingId === tour.id}
                status={tour.status}
                message={tour.message}
                onCancel={() => onCancelTour?.(tour.id)}
              />
            </div>
          ))}
        </div>
        {tours.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
            No upcoming tours found.
          </div>
        )}
      </div>
    </div>
  );
}
