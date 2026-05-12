'use client';

import { useQuery } from '@tanstack/react-query';
import { queryTiming } from '../../react-query/query-options';
import { getMyProperties } from '../../services/property-service/property-service-clientt';

export function useGetMyProperties(enabled = true) {
  return useQuery({
    queryKey: ['my-properties'],
    queryFn: getMyProperties,
    enabled,
    ...queryTiming.list,
  });
}
