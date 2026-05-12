'use client';

import { TourModel2 } from '@/app/apis/models/tour-model';
import MessageCard from './message-card';
import { IconImage } from '@/components/icon-image/icon-image';
import LoadMoreTrigger from '@/components/load-more-trigger';

interface Message {
  id: string;
  name: string;
  message: string;
  date: string;
  property: string;
  timestamp: string;
  avatar?: string;
  tour: TourModel2;
}

interface MessagesSectionProps {
  messages: Message[];
  hasNextPage?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
}

export default function MessagesSection({
  messages,
  hasNextPage,
  isFetchingMore,
  onLoadMore,
}: MessagesSectionProps) {
  return (
    <section className="mt-10 mb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold font-[Georgia]">Messages</h2>

        <IconImage src="/icons/mail (1).svg" alt="messages" width={26} height={26} />
      </div>

      {/* Grid */}
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-6
      "
      >
        {messages.map((msg) => (
          <MessageCard key={msg.id} {...msg} />
        ))}
      </div>

      {messages.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
          No messages yet.
        </div>
      )}

      <LoadMoreTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingMore}
        onLoadMore={onLoadMore}
        showNoMore={messages.length > 0}
      />
    </section>
  );
}
