'use server';

import { ApiResponse } from '../../base-response';
import { api } from '../../call-apis';
import { AgentModel, CreateAgentPayload, UpdateAgentPayload } from '../../models/agent-model';

export async function createAgentServer(
  payload: CreateAgentPayload,
): Promise<ApiResponse<AgentModel>> {
  const formData = new FormData();

  formData.append('firstName', payload.firstName);
  formData.append('lastName', payload.lastName);
  formData.append('dateOfBirth', payload.dateOfBirth);
  formData.append('city', payload.city);
  formData.append('address', payload.address);
  formData.append('nationality', payload.nationality);
  formData.append('nin', payload.nin);
  formData.append('companyName', payload.companyName);
  formData.append('yearsOfExperience', payload.yearsOfExperience.toString());
  formData.append('description', payload.description);
  formData.append('isAgreement', payload.isAgreement.toString());

  if (payload.cacNumber) {
    formData.append('cacNumber', payload.cacNumber);
  }

  formData.append('selfie', payload.selfie);
  formData.append('ninSlip', payload.ninSlip);

  if (payload.cacDoc) {
    formData.append('cacDoc', payload.cacDoc);
  }

  const res = await api.authPost<AgentModel>('/agent', formData);

  return res;
}

export async function getAgentByIdServer(agentId: string): Promise<ApiResponse<AgentModel>> {
  const res = await api.authGet<AgentModel>(`/agent/userAgent/${agentId}`);

  return res;
}

export async function getCurrentAgentServer(): Promise<ApiResponse<AgentModel>> {
  const res = await api.authGet<AgentModel>('/agent/me');

  return res;
}

export async function completeProfileServer(
  payload: CreateAgentPayload,
): Promise<ApiResponse<AgentModel>> {
  const formData = new FormData();

  formData.append('firstName', payload.firstName);
  formData.append('lastName', payload.lastName);
  formData.append('dateOfBirth', payload.dateOfBirth);
  formData.append('city', payload.city);
  formData.append('address', payload.address);
  formData.append('nationality', payload.nationality);
  formData.append('nin', payload.nin);
  formData.append('companyName', payload.companyName);
  formData.append('yearsOfExperience', payload.yearsOfExperience.toString());
  formData.append('description', payload.description);
  formData.append('isAgreement', payload.isAgreement.toString());

  if (payload.cacNumber) {
    formData.append('cacNumber', payload.cacNumber);
  }

  formData.append('selfie', payload.selfie);
  formData.append('ninSlip', payload.ninSlip);

  if (payload.cacDoc) {
    formData.append('cacDoc', payload.cacDoc);
  }

  const res = await api.authPatch<AgentModel>('/agent/complete-profile', formData);

  return res;
}

export async function updateAgentServer(
  payload: UpdateAgentPayload,
): Promise<ApiResponse<AgentModel>> {
  const formData = new FormData();

  if (payload.city !== undefined) formData.append('city', payload.city);
  if (payload.address !== undefined) formData.append('address', payload.address);
  if (payload.nationality !== undefined) formData.append('nationality', payload.nationality);
  if (payload.cacNumber !== undefined) formData.append('cacNumber', payload.cacNumber);
  if (payload.companyName !== undefined) formData.append('companyName', payload.companyName);
  if (payload.description !== undefined) formData.append('description', payload.description);

  if (payload.yearsOfExperience !== undefined) {
    formData.append('yearsOfExperience', payload.yearsOfExperience.toString());
  }

  if (payload.selfie) formData.append('selfie', payload.selfie);
  if (payload.cacDoc) formData.append('cacDoc', payload.cacDoc);
  if (payload.selfie && payload.selfiePublicId) {
    formData.append('selfiePublicId', payload.selfiePublicId);
  }
  if (payload.cacDoc && payload.cacDocPublicId) {
    formData.append('cacDocPublicId', payload.cacDocPublicId);
  }

  const res = await api.authPatch<AgentModel>('/agent/me', formData);

  return res;
}
