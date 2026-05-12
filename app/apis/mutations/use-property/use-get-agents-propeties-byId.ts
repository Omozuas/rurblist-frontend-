'use client';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { ApiResponse } from '../../base-response';
import { NextCursorModel } from '../../models/nextconsor-model';
import { PropertyModel } from '../../models/property-model';
import { getNextCursorPageParam } from '../../react-query/get-next-page-param';
import { queryTiming } from '../../react-query/query-options';
import { getAgentPropertiesById } from '../../services/property-service/property-service-clientt';

export function useGetAgentPropertiesById(id: string) {
  return useInfiniteQuery<
    ApiResponse<PropertyModel[]>,
    Error,
    InfiniteData<ApiResponse<PropertyModel[]>>,
    [string, string],
    NextCursorModel | undefined
  >({
    queryKey: ['agent-property', id],
    queryFn: ({ pageParam }) => getAgentPropertiesById(id, pageParam),
    initialPageParam: undefined,
    enabled: !!id,
    getNextPageParam: getNextCursorPageParam,
    ...queryTiming.list,
  });
}
