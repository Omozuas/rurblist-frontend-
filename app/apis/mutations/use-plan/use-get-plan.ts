'use client';

import { useQuery } from '@tanstack/react-query';
import { queryTiming } from '../../react-query/query-options';
import { getPlans } from '../../services/plan-service/plan-service-client';

export function useGetPlans() {
  return useQuery({
    queryKey: ['plans-data'],
    queryFn: getPlans,
    ...queryTiming.static,
  });
}
