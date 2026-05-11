'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrangeButton } from '@/components/button/button';
import { useAuth } from './auth-provider';

const STORAGE_KEY = 'rurblist-agent-profile-reminder-seen';

export function AgentProfileReminder() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const agent = user?.agent;
  const isAgent = Boolean(agent || user?.user?.roles?.includes('agent'));

  useEffect(() => {
    if (isLoading || !isAgent || !agent || agent.isAgreement) return;

    const storageKey = `${STORAGE_KEY}-${agent._id}`;
    const hasSeenReminder = sessionStorage.getItem(storageKey);

    if (!hasSeenReminder) {
      const timer = window.setTimeout(() => setIsOpen(true), 0);
      sessionStorage.setItem(storageKey, 'true');
      return () => window.clearTimeout(timer);
    }
  }, [agent, isAgent, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
        <h2 className="font-[Georgia] text-xl font-bold text-[#833700]">
          Complete your agent profile
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Your agent details need to be updated before your profile can be completed.
        </p>

        <div className="mt-6 flex gap-3">
          <OrangeButton type="button" variant="white" fullWidth onClick={() => setIsOpen(false)}>
            Cancel
          </OrangeButton>

          <OrangeButton
            type="button"
            fullWidth
            onClick={() => {
              setIsOpen(false);
              router.push('/agent/request');
            }}
          >
            Update Details
          </OrangeButton>
        </div>
      </div>
    </div>
  );
}
