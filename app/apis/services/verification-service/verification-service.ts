import { ApiResponse } from '../../base-response';
import { api } from '../../call-apis';
import { VerficationModel } from '../../models/verification-model';

export async function getVerificationsServer(): Promise<ApiResponse<VerficationModel[]>> {
  const res = await api.authGet<VerficationModel[]>('/verifications/me');

  return res;
}

export async function getVerificationByIdServer(
  id: string,
): Promise<ApiResponse<VerficationModel>> {
  const res = await api.authGet<VerficationModel>(`/verifications/${id}`);

  return res;
}
