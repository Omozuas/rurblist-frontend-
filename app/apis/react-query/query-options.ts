import { keepPreviousData } from '@tanstack/react-query';

export const queryTiming = {
  static: {
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  },
  list: {
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  },
  detail: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  },
};
