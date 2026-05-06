import { NextCursorModel } from './models/nextconsor-model';

export type ApiResponse<T> = {
  data?: T;
  message: string;
  statusCode: number;
  error?: string;
  success?: boolean;
  count?: number;
  hasNextPage?: boolean;
  nextCursor?: NextCursorModel;
};

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
