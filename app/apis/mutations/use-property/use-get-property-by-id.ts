'use client';

import { useQuery } from '@tanstack/react-query';
import { queryTiming } from '../../react-query/query-options';
import { getPropertyById } from '../../services/property-service/property-service-clientt';

export function useGetPropertyById(id: string) {
  return useQuery({
    queryKey: ['propertyId', id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
    ...queryTiming.detail,
  });
}
