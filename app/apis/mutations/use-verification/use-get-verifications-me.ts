'use client';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { ApiResponse } from '../../base-response';
import { NextCursorModel } from '../../models/nextconsor-model';
import { VerficationModel } from '../../models/verification-model';
import { getNextCursorPageParam } from '../../react-query/get-next-page-param';
import { queryTiming } from '../../react-query/query-options';
import { getVerification } from '../../services/verification-service/verification-service-client';

export function useGetVerifications(enabled = true) {
  return useInfiniteQuery<
    ApiResponse<VerficationModel[]>,
    Error,
    InfiniteData<ApiResponse<VerficationModel[]>>,
    [string],
    NextCursorModel | undefined
  >({
    queryKey: ['verification-me'],
    queryFn: ({ pageParam }) => getVerification(pageParam),
    initialPageParam: undefined,
    enabled,
    getNextPageParam: getNextCursorPageParam,
    ...queryTiming.list,
  });
}
