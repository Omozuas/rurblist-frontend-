'use client';

import { useQuery } from '@tanstack/react-query';
import { queryTiming } from '../../react-query/query-options';
import { getTourAgent } from '../../services/tour-service/tour-service-client';

export function useGetTourAgents(enabled = true) {
  return useQuery({
    queryKey: ['tour-agent'],
    queryFn: () => getTourAgent(),
    enabled,
    ...queryTiming.list,
  });
}
