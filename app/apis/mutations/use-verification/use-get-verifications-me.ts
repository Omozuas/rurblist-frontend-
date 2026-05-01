'use client';

import { useQuery } from '@tanstack/react-query';
import { getVerification } from '../../services/verification-service/verification-service-client';

export function useGetVerifications() {
  return useQuery({
    queryKey: ['verification-me'],
    queryFn: getVerification,
    refetchOnWindowFocus: true,
  });
}
