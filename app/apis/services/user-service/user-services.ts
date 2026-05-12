'use server';
import { ApiResponse } from '../../base-response';
import { api } from '../../call-apis';
import { NextCursorModel } from '../../models/nextconsor-model';
import { PropertyModel } from '../../models/property-model';
import { currentUserModel } from '../../models/user-model';
import { buildCursorQuery } from '../../utils/build-cursor-query';

export async function getCurrentUserServer(): Promise<ApiResponse<currentUserModel>> {
  const res = await api.authGet<currentUserModel>('/user/me');
  if (res.statusCode === 401) {
    return {
      data: null as never,
      message: 'Unauthenticated',
      statusCode: 401,
    };
  }

  return res;
}

export async function getSavedPropertiesServer(
  cursor?: NextCursorModel,
): Promise<ApiResponse<PropertyModel[]>> {
  const res = await api.authGet<PropertyModel[]>(`/user/saved${buildCursorQuery(cursor)}`);

  return res;
}
