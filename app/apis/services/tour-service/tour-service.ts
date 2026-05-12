'use server';

import { ApiResponse } from '../../base-response';
import { api } from '../../call-apis';
import { NextCursorModel } from '../../models/nextconsor-model';
import { BookInspectionPayload, TourModel, TourModel2 } from '../../models/tour-model';
import { buildCursorQuery } from '../../utils/build-cursor-query';

export async function bookInspectionServer(
  payload: BookInspectionPayload,
): Promise<ApiResponse<TourModel>> {
  const response = await api.authPost<TourModel>('/tours', payload);

  return response;
}

export async function getTourByIdServer(id: string): Promise<ApiResponse<TourModel2>> {
  const response = await api.authGet<TourModel2>(`/tours/${id}`);

  return response;
}

export async function getTourUserServer(
  cursor?: NextCursorModel,
): Promise<ApiResponse<TourModel2[]>> {
  const response = await api.authGet<TourModel2[]>(`/tours/user${buildCursorQuery(cursor)}`);

  return response;
}

export async function getTourAgentServer(
  cursor?: NextCursorModel,
): Promise<ApiResponse<TourModel2[]>> {
  const response = await api.authGet<TourModel2[]>(`/tours/agent${buildCursorQuery(cursor)}`);

  return response;
}

export async function cancelleTourServer(tourId: string): Promise<ApiResponse<null>> {
  const response = await api.authPut<null>(`/tours/cancel/${tourId}`);

  return response;
}

// ✅ Confirm Tour
export async function confirmTourServer(tourId: string, note?: string): Promise<ApiResponse<null>> {
  return api.authPut<null>(`/tours/confirm/${tourId}`, { note });
}

// ✅ Reschedule Tour
export async function rescheduleTourServer(
  tourId: string,
  newDate: string,
): Promise<ApiResponse<null>> {
  return api.authPut<null>(`/tours/reschedule/${tourId}`, {
    newDate,
  });
}
