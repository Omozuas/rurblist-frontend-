'use client';

import { useQuery } from '@tanstack/react-query';
import { queryTiming } from '../../react-query/query-options';
import { getVerification } from '../../services/verification-service/verification-service-client';

export function useGetVerifications(enabled = true) {
  return useQuery({
    queryKey: ['verification-me'],
    queryFn: getVerification,
    enabled,
    ...queryTiming.list,
  });
}
