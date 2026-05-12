import { ApiResponse } from '../../base-response';
import { api } from '../../call-apis';
import { NextCursorModel } from '../../models/nextconsor-model';
import { VerficationModel } from '../../models/verification-model';
import { buildCursorQuery } from '../../utils/build-cursor-query';

export async function getVerificationsServer(
  cursor?: NextCursorModel,
): Promise<ApiResponse<VerficationModel[]>> {
  const res = await api.authGet<VerficationModel[]>(
    `/verifications/me${buildCursorQuery(cursor)}`,
  );

  return res;
}

export async function getAllVerificationsServer(
  cursor?: NextCursorModel,
): Promise<ApiResponse<VerficationModel[]>> {
  const res = await api.authGet<VerficationModel[]>(`/verifications${buildCursorQuery(cursor)}`);

  return res;
}

export async function getVerificationByIdServer(
  id: string,
): Promise<ApiResponse<VerficationModel>> {
  const res = await api.authGet<VerficationModel>(`/verifications/${id}`);

  return res;
}
