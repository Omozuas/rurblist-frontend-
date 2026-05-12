'use client';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { ApiResponse } from '../../base-response';
import { NextCursorModel } from '../../models/nextconsor-model';
import { PropertyModel } from '../../models/property-model';
import { getNextCursorPageParam } from '../../react-query/get-next-page-param';
import { queryTiming } from '../../react-query/query-options';
import { getMyProperties } from '../../services/property-service/property-service-clientt';

export function useGetMyProperties(enabled = true) {
  return useInfiniteQuery<
    ApiResponse<PropertyModel[]>,
    Error,
    InfiniteData<ApiResponse<PropertyModel[]>>,
    [string],
    NextCursorModel | undefined
  >({
    queryKey: ['my-properties'],
    queryFn: ({ pageParam }) => getMyProperties(pageParam),
    initialPageParam: undefined,
    enabled,
    getNextPageParam: getNextCursorPageParam,
    ...queryTiming.list,
  });
}
