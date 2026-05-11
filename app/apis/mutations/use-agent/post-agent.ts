'use client';

import { useMutation } from '@tanstack/react-query';
import { CreateAgentPayload, UpdateAgentPayload } from '../../models/agent-model';
import toast from 'react-hot-toast';
import {
  completeProfile,
  createAgent,
  updateAgent,
} from '../../services/agent-service/agent-service-client';

export function useCreateAgent(isAgent: boolean) {
  return useMutation({
    mutationFn: (data: CreateAgentPayload) => (isAgent ? completeProfile(data) : createAgent(data)),
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateAgent() {
  return useMutation({
    mutationFn: (data: UpdateAgentPayload) => updateAgent(data),
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
