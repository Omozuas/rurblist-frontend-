'use client';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { ApiResponse } from '../../base-response';
import { NextCursorModel } from '../../models/nextconsor-model';
import { TourModel2 } from '../../models/tour-model';
import { getNextCursorPageParam } from '../../react-query/get-next-page-param';
import { queryTiming } from '../../react-query/query-options';
import { getTourUser } from '../../services/tour-service/tour-service-client';

export function useGetTourUsers(enabled = true) {
  return useInfiniteQuery<
    ApiResponse<TourModel2[]>,
    Error,
    InfiniteData<ApiResponse<TourModel2[]>>,
    [string],
    NextCursorModel | undefined
  >({
    queryKey: ['tour-user'],
    queryFn: ({ pageParam }) => getTourUser(pageParam),
    initialPageParam: undefined,
    enabled,
    getNextPageParam: getNextCursorPageParam,
    ...queryTiming.list,
  });
}
