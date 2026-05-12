'use client';

import { useQuery } from '@tanstack/react-query';
import { queryTiming } from '../../react-query/query-options';
import { getSavedProperties } from '../../services/user-service/user-service-client';

export function useGetSavedProperties(enabled = true) {
  return useQuery({
    queryKey: ['saved-propertys'],
    queryFn: getSavedProperties,
    enabled,
    ...queryTiming.list,
  });
}
