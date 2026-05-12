'use client';

import { ApiResponse } from '../../base-response';
import { NextCursorModel } from '../../models/nextconsor-model';
import { PropertyModel } from '../../models/property-model';
import { currentUserModel } from '../../models/user-model';
import { getCurrentUserServer, getSavedPropertiesServer } from './user-services';

export async function getCurrentUser(): Promise<ApiResponse<currentUserModel>> {
  const res = await getCurrentUserServer();
  if (res.statusCode === 401) {
    return {
      data: null as never,
      message: 'Unauthenticated',
      statusCode: 401,
    };
  }
  if (res.error) {
    throw new Error(res.message);
  }

  return res;
}

export async function getSavedProperties(
  cursor?: NextCursorModel,
): Promise<ApiResponse<PropertyModel[]>> {
  const res = await getSavedPropertiesServer(cursor);
  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}
