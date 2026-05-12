'use client';

import { useQuery } from '@tanstack/react-query';
import { queryTiming } from '../../react-query/query-options';
import { getAgentById } from '../../services/agent-service/agent-service-client';

export function useGetAgentById(agentId?: string) {
  return useQuery({
    queryKey: ['agentById', agentId],
    queryFn: () => getAgentById(agentId!),
    enabled: !!agentId,
    ...queryTiming.detail,
  });
}
