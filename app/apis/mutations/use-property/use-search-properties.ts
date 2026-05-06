'use client';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { ApiResponse } from '../../base-response';
import { NextCursorModel } from '../../models/nextconsor-model';
import { PropertyModel, PropertySearchParams } from '../../models/property-model';
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

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) return undefined;

      return lastPage.nextCursor ?? undefined;
    },

    placeholderData: (previousData) => previousData,
  });
}
