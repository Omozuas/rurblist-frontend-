'use client';

import { ApiResponse } from '../../base-response';
import { NextCursorModel } from '../../models/nextconsor-model';
import { BookInspectionPayload, TourModel, TourModel2 } from '../../models/tour-model';
import {
  bookInspectionServer,
  cancelleTourServer,
  confirmTourServer,
  getTourAgentServer,
  getTourByIdServer,
  getTourUserServer,
  rescheduleTourServer,
} from './tour-service';

export async function bookInspection(
  payload: BookInspectionPayload,
): Promise<ApiResponse<TourModel>> {
  const response = await bookInspectionServer(payload);

  if (response.statusCode >= 400) {
    throw new Error(response.message);
  }
  return response;
}

export async function getTourById(id: string): Promise<ApiResponse<TourModel2>> {
  const response = await getTourByIdServer(id);

  if (response.statusCode >= 400) {
    throw new Error(response.message);
  }
  return response;
}

export async function getTourAgent(
  cursor?: NextCursorModel,
): Promise<ApiResponse<TourModel2[]>> {
  const response = await getTourAgentServer(cursor);

  if (response.statusCode >= 400) {
    throw new Error(response.message);
  }
  return response;
}

export async function getTourUser(
  cursor?: NextCursorModel,
): Promise<ApiResponse<TourModel2[]>> {
  const response = await getTourUserServer(cursor);

  if (response.statusCode >= 400) {
    throw new Error(response.message);
  }
  return response;
}

export async function cancelleTour(tourId: string): Promise<ApiResponse<null>> {
  const response = await cancelleTourServer(tourId);

  if (response.statusCode >= 400) {
    throw new Error(response.message);
  }
  return response;
}

// ✅ Confirm Tour
export async function confirmTour(data: {
  tourId: string;
  note?: string;
}): Promise<ApiResponse<null>> {
  const res = await confirmTourServer(data.tourId, data.note);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

// ✅ Reschedule Tour
export async function rescheduleTour(data: {
  tourId: string;
  newDate: string;
}): Promise<ApiResponse<null>> {
  const res = await rescheduleTourServer(data.tourId, data.newDate);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}
