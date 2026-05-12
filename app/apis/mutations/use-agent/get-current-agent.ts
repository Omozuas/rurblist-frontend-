'use client';

import { useQuery } from '@tanstack/react-query';
import { queryTiming } from '../../react-query/query-options';
import { getCurrentAgent } from '../../services/agent-service/agent-service-client';

export function useGetCurrentAgent() {
  return useQuery({
    queryKey: ['current-agent'],
    queryFn: getCurrentAgent,
    ...queryTiming.detail,
  });
}
