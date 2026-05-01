import { ApiResponse } from '../../base-response';
import { VerficationModel } from '../../models/verification-model';
import { getVerificationByIdServer, getVerificationsServer } from './verification-service';

export async function getVerification(): Promise<ApiResponse<VerficationModel[]>> {
  const res = await getVerificationsServer();

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
