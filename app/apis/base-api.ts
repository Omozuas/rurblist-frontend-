'use server';

import { cookies } from 'next/headers';
import { ApiResponse, HttpMethod } from './base-response';
import { getErrorMessage } from './errors';
import { API_URL, AUTHENTICATION_COOKIE } from './utils/api-links';
import {
  subscribeTokenRefresh,
  onRefreshed,
  getRefreshing,
  setRefreshing,
} from './utils/token-manager';
import { clearAuthCookies } from './services/auth-services/logout-service';
import { refreshTokenServer } from './services/auth-services/auth-services';

const DEFAULT_TIMEOUT = 140000; // 2 minutes

function buildErrorResponse(message: string, statusCode: number, error = 'Request failed') {
  return {
    error,
    message,
    statusCode,
  };
}
// ✅ Blob response type
export type BlobResponse = {
  blob: Blob;
  headers: Record<string, string>;
};

type ParsedApiResponse = {
  data?: unknown;
  message?: string | string[];
  statusCode?: number;
  error?: string;
  success?: boolean;
  count?: number;
  hasNextPage?: boolean;
  nextCursor?: ApiResponse<unknown>['nextCursor'];
};

export async function request<T = unknown>(
  method: HttpMethod,
  path: string,
  options?: {
    payload?: unknown;
    protected?: boolean;
    retries?: number;
    responseType?: 'json';
  },
): Promise<ApiResponse<T>>;

export async function request(
  method: HttpMethod,
  path: string,
  options: {
    payload?: unknown;
    protected?: boolean;
    retries?: number;
    responseType: 'blob';
  },
): Promise<BlobResponse>;

export async function request<T = unknown>(
  method: HttpMethod,
  path: string,
  options?: {
    payload?: unknown;
    protected?: boolean;
    retries?: number;
    responseType?: 'json' | 'blob';
  },
): Promise<ApiResponse<T> | BlobResponse> {
  const payload = options?.payload;
  const protectedRoute = options?.protected;
  const retries = options?.retries ?? 1;
  const responseType = options?.responseType ?? 'json';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE!)?.value;

    const headers: HeadersInit = {};
    const isFormData = payload instanceof FormData;

    if (!isFormData && responseType === 'json') {
      headers['Content-Type'] = 'application/json';
    }

    if (protectedRoute && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const cookieHeader = cookieStore.toString();
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const url = new URL(`/api${path}`, API_URL);

    const response = await fetch(url, {
      method,
      headers,
      body:
        method !== 'GET' && payload
          ? payload instanceof FormData
            ? payload
            : JSON.stringify(payload)
          : undefined,
      cache: 'no-store',
      signal: controller.signal,
      credentials: 'include',
    });

    clearTimeout(timeout);

    // =========================
    // 🔥 HANDLE AUTH REFRESH FIRST
    // =========================
    if ((response.status === 401 || response.status === 403) && protectedRoute) {
      if (!getRefreshing()) {
        setRefreshing(true);
        try {
          const refreshRes = await refreshTokenServer();
          const newToken = refreshRes?.data?.accessToken;

          if (!newToken) throw new Error('Refresh failed');

          onRefreshed(newToken);
          setRefreshing(false);

          if (responseType === 'blob') {
            return request(method, path, {
              payload,
              protected: protectedRoute,
              responseType: 'blob',
            });
          }

          return request<T>(method, path, {
            payload,
            protected: protectedRoute,
            responseType: 'json',
          });
        } catch {
          setRefreshing(false);
          await clearAuthCookies();

          return {
            error: 'SESSION_EXPIRED',
            message: 'Session expired. Please login again.',
            statusCode: 401,
          };
        }
      }

      return new Promise<ApiResponse<T> | BlobResponse>((resolve) => {
        subscribeTokenRefresh(async () => {
          let result: ApiResponse<T> | BlobResponse;

          if (options?.responseType === 'blob') {
            result = await request(method, path, {
              payload,
              protected: protectedRoute,
              responseType: 'blob',
            });
          } else {
            result = await request<T>(method, path, {
              payload,
              protected: protectedRoute,
              responseType: 'json',
            });
          }

          resolve(result);
        });
      });
    }

    // =========================
    // 🔥 BLOB FLOW
    // =========================
    if (responseType === 'blob') {
      if (!response.ok) {
        const err = (await response.json()) as ParsedApiResponse;

        return buildErrorResponse(
          getErrorMessage(err) ?? 'Something went wrong',
          err?.statusCode ?? response.status,
          err?.error ?? 'Download failed',
        );
      }
      const headersObj: Record<string, string> = {};

      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      return {
        blob: await response.blob(),
        headers: headersObj,
      };
    }

    // =========================
    // 🔥 JSON FLOW
    // =========================
    const contentType = response.headers.get('content-type');

    let parsed: ParsedApiResponse | null = null;

    if (contentType?.includes('application/json')) {
      parsed = (await response.json()) as ParsedApiResponse;
    }

    if (!response.ok || parsed?.error || (parsed?.statusCode ?? 0) >= 400) {
      return buildErrorResponse(
        getErrorMessage(parsed) ?? 'Something went wrong',
        parsed?.statusCode ?? response.status,
        parsed?.error ?? 'Request failed',
      );
    }

    return {
      data: parsed?.data as T,
      message: getErrorMessage(parsed) ?? 'Success',
      statusCode: response.status,
      success: parsed?.success,
      count: parsed?.count,
      hasNextPage: parsed?.hasNextPage,
      nextCursor: parsed?.nextCursor,
    };
  } catch (error) {
    if (retries > 0) {
      if (responseType === 'blob') {
        return request(method, path, {
          payload,
          protected: protectedRoute,
          retries: retries - 1,
          responseType: 'blob',
        });
      }

      return request<T>(method, path, {
        payload,
        protected: protectedRoute,
        retries: retries - 1,
        responseType: 'json',
      });
    }

    console.error('REQUEST ERROR:', error);

    return {
      error: 'Network Error',
      message: 'Unable to connect to server',
      statusCode: 500,
    };
  }
}
