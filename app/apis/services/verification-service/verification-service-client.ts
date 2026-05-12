import { ApiResponse } from '../../base-response';
import { NextCursorModel } from '../../models/nextconsor-model';
import { VerficationModel } from '../../models/verification-model';
import {
  getAllVerificationsServer,
  getVerificationByIdServer,
  getVerificationsServer,
} from './verification-service';

export async function getVerification(
  cursor?: NextCursorModel,
): Promise<ApiResponse<VerficationModel[]>> {
  const res = await getVerificationsServer(cursor);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function getAllVerifications(
  cursor?: NextCursorModel,
): Promise<ApiResponse<VerficationModel[]>> {
  const res = await getAllVerificationsServer(cursor);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function getVerificationById(id: string): Promise<ApiResponse<VerficationModel>> {
  const res = await getVerificationByIdServer(id);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}
