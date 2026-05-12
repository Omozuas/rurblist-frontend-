'use client';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { ApiResponse } from '../../base-response';
import { CommentModel } from '../../models/comment-model';
import { NextCursorModel } from '../../models/nextconsor-model';
import { getNextCursorPageParam } from '../../react-query/get-next-page-param';
import { getCommentsByPropertyId } from '../../services/comment-service/comment-service-client';

export function usePropertyComments(propertyId: string) {
  return useInfiniteQuery<
    ApiResponse<CommentModel[]>, // response
    Error, // error
    InfiniteData<ApiResponse<CommentModel[]>>, // data select
    [string, string], // query key
    NextCursorModel | undefined // pageParam
  >({
    queryKey: ['get-comments', propertyId],

    queryFn: ({ pageParam }) => {
      return getCommentsByPropertyId({ propertyId, cursor: pageParam });
    },

    initialPageParam: undefined,

    getNextPageParam: getNextCursorPageParam,
    // ✅ v5 replacement for keepPreviousData
    // placeholderData: (previousData) => previousData,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true, // ✅ IMPORTANT
    refetchOnWindowFocus: false, // optional
  });
}
