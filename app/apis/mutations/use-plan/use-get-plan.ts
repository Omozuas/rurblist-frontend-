'use client';

import { useQuery } from '@tanstack/react-query';
import { getPlans } from '../../services/plan-service/plan-service-client';

export function useGetPlans() {
  return useQuery({
    queryKey: ['plans-data'],
    queryFn: getPlans,
    refetchOnWindowFocus: true,
  });
}
