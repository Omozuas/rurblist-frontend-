'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  likeProperty,
  unlikeProperty,
} from '../../services/property-service/property-service-clientt';

export function useLikeProperty() {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: (propertyId: string) => likeProperty(propertyId),

    onSuccess: (_, propertyId) => {
      // Refetch property details
      queryClient.invalidateQueries({
        queryKey: ['propertyId', propertyId],
      });

      // Refetch lists if needed
      queryClient.invalidateQueries({
        queryKey: ['search-properties'],
      });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (propertyId: string) => unlikeProperty(propertyId),

    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({
        queryKey: ['propertyId', propertyId],
      });

      queryClient.invalidateQueries({
        queryKey: ['search-properties'],
      });
    },
  });

  return {
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
}
