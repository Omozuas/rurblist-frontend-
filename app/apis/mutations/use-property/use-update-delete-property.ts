'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  deleteProperty,
  updateProperty,
} from '../../services/property-service/property-service-clientt';

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => deleteProperty(propertyId),
    onSuccess: (data) => {
      toast.success(data.message || 'Property deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, data }: { propertyId: string; data: FormData }) =>
      updateProperty(propertyId, data),
    onSuccess: (data, variables) => {
      toast.success(data.message || 'Property updated successfully');
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['propertyId', variables.propertyId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
