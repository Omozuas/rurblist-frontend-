'use client';

import { useQuery } from '@tanstack/react-query';
import { queryTiming } from '../../react-query/query-options';
import { getTourUser } from '../../services/tour-service/tour-service-client';

export function useGetTourUsers(enabled = true) {
  return useQuery({
    queryKey: ['tour-user'],
    queryFn: () => getTourUser(),
    enabled,
    ...queryTiming.list,
  });
}
