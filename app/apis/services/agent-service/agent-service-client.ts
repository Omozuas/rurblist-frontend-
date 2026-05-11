'use client';

import { ApiResponse } from '../../base-response';
import { AgentModel, CreateAgentPayload, UpdateAgentPayload } from '../../models/agent-model';
import {
  completeProfileServer,
  createAgentServer,
  getAgentByIdServer,
  getCurrentAgentServer,
  updateAgentServer,
} from './agent-service';

export async function createAgent(payload: CreateAgentPayload): Promise<ApiResponse<AgentModel>> {
  const res = await createAgentServer(payload);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function getAgentById(agentId: string): Promise<ApiResponse<AgentModel>> {
  const res = await getAgentByIdServer(agentId);
  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }
  return res;
}

export async function getCurrentAgent(): Promise<ApiResponse<AgentModel>> {
  const res = await getCurrentAgentServer();
  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function completeProfile(
  payload: CreateAgentPayload,
): Promise<ApiResponse<AgentModel>> {
  const res = await completeProfileServer(payload);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function updateAgent(payload: UpdateAgentPayload): Promise<ApiResponse<AgentModel>> {
  const res = await updateAgentServer(payload);
  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }
  return res;
}
