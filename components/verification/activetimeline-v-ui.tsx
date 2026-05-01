'use client';

import React from 'react';
import { AlertTriangle, Check, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ActivityStatus = 'success' | 'info' | 'warning' | 'failed';

export type ActivityTimelineItem = {
  title: string;
  date: string | Date;
  status: ActivityStatus;
};

interface ActivityTimelineProps {
  items: ActivityTimelineItem[];
  className?: string;
  showRelativeTime?: boolean;
}

const statusConfig: Record<
  ActivityStatus,
  {
    icon: React.ReactNode;
    color: string;
    bg: string;
    line: string;
  }
> = {
  success: {
    icon: <Check className="h-5 w-5" strokeWidth={3} />,
    color: 'text-[#28b34b]',
    bg: 'bg-[#e9f9ee]',
    line: 'bg-[#28b34b]',
  },
  info: {
    icon: <Info className="h-5 w-5" strokeWidth={2.5} />,
    color: 'text-[#2563eb]',
    bg: 'bg-[#eaf1ff]',
    line: 'bg-[#2563eb]',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />,
    color: 'text-[#f59e0b]',
    bg: 'bg-[#fff6df]',
    line: 'bg-[#f59e0b]',
  },
  failed: {
    icon: <X className="h-5 w-5" strokeWidth={3} />,
    color: 'text-[#dc2626]',
    bg: 'bg-[#fdecec]',
    line: 'bg-[#dc2626]',
  },
};

function formatRelativeTime(date: string | Date) {
  const target = new Date(date).getTime();
  const now = Date.now();
  const diff = Math.floor((now - target) / 1000);

  if (Number.isNaN(target)) return String(date);
  if (diff < 60) return 'Just now';

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatFullDate(date: string | Date) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return String(date);

  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ActivityTimeline({
  items,
  className,
  showRelativeTime = true,
}: ActivityTimelineProps) {
  return (
    <section className={cn('w-full px-4 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-[20px] font-semibold text-black sm:text-[24px]">Activity Timeline</h2>

        <div className="mt-8">
          {items.map((item, index) => {
            const config = statusConfig[item.status];
            const isLast = index === items.length - 1;

            return (
              <div
                key={`${item.title}-${index}`}
                className="relative flex gap-4 pb-9 last:pb-0 sm:gap-6"
              >
                {!isLast && (
                  <span className="absolute left-[18px] top-10 h-[calc(100%-40px)] w-[2px] bg-gray-200 sm:left-[20px]" />
                )}

                {!isLast && (
                  <span
                    className={cn(
                      'absolute left-[18px] top-10 h-[calc(100%-40px)] w-[2px] origin-top animate-[timelineGrow_700ms_ease-out_forwards] sm:left-[20px]',
                      config.line,
                    )}
                  />
                )}

                <div
                  className={cn(
                    'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-500 sm:h-10 sm:w-10',
                    'animate-[statusPop_450ms_ease-out_forwards]',
                    config.bg,
                    config.color,
                  )}
                >
                  {config.icon}
                </div>

                <div className="min-w-0 pt-1">
                  <p className="text-[15px] font-medium leading-tight text-black sm:text-[18px]">
                    {item.title}
                  </p>

                  <p className="mt-2 text-[14px] leading-tight text-gray-600 sm:text-[16px]">
                    {showRelativeTime ? formatRelativeTime(item.date) : formatFullDate(item.date)}
                  </p>

                  {showRelativeTime && (
                    <p className="mt-1 text-[12px] text-gray-400 sm:text-[13px]">
                      {formatFullDate(item.date)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes timelineGrow {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }

        @keyframes statusPop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          70% {
            transform: scale(1.08);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
