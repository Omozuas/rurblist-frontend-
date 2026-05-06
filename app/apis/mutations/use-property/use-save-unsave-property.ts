'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  saveProperty,
  unsaveProperty,
} from '../../services/property-service/property-service-clientt';

export function useSaveProperty() {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (propertyId: string) => saveProperty(propertyId),
    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({ queryKey: ['saved-propertys'] });
      queryClient.invalidateQueries({ queryKey: ['saved-properties', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['search-properties'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: (propertyId: string) => unsaveProperty(propertyId),
    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({ queryKey: ['saved-propertys'] });
      queryClient.invalidateQueries({ queryKey: ['search-properties'] });
      queryClient.invalidateQueries({ queryKey: ['saved-properties', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });

  return {
    save: saveMutation.mutate,
    unsave: unsaveMutation.mutate,
    isSaving: saveMutation.isPending,
    isUnSaving: unsaveMutation.isPending,
  };
}
