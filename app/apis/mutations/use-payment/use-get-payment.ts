'use client';

import { useQuery } from '@tanstack/react-query';
import { queryTiming } from '../../react-query/query-options';
import { getPaymentDeails } from '../../services/payment-service/payment-service-client';

export function useGetPaymentDeails(reference?: string) {
  return useQuery({
    queryKey: ['payment-details', reference],
    queryFn: () => getPaymentDeails(reference!),
    enabled: !!reference,
    ...queryTiming.detail,
  });
}
