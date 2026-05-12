'use client';

import { useQuery } from '@tanstack/react-query';
import { queryTiming } from '../../react-query/query-options';
import { getTourById } from '../../services/tour-service/tour-service-client';

export function useGetTourById(tourId?: string) {
  return useQuery({
    queryKey: ['tourById', tourId],
    queryFn: () => getTourById(tourId!),
    enabled: !!tourId,
    ...queryTiming.detail,
  });
}
