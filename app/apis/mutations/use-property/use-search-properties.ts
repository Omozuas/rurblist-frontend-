'use client';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { ApiResponse } from '../../base-response';
import { NextCursorModel } from '../../models/nextconsor-model';
import { PropertyModel, PropertySearchParams } from '../../models/property-model';
import { getNextCursorPageParam } from '../../react-query/get-next-page-param';
import { queryTiming } from '../../react-query/query-options';
import { searchProperties } from '../../services/property-service/property-service-clientt';

export function useSearchProperties(params: PropertySearchParams) {
  return useInfiniteQuery<
    ApiResponse<PropertyModel[]>,
    Error,
    InfiniteData<ApiResponse<PropertyModel[]>>,
    [string, PropertySearchParams],
    NextCursorModel | undefined
  >({
    queryKey: ['search-properties', params],
    queryFn: ({ pageParam }) =>
      searchProperties({
        ...params,
        cursor: pageParam ? JSON.stringify(pageParam) : undefined,
      }),

    initialPageParam: undefined,

    getNextPageParam: getNextCursorPageParam,

    ...queryTiming.list,
  });
}
