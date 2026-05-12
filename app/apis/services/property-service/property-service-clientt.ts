'use client';

import { ApiResponse } from '../../base-response';
import { NextCursorModel } from '../../models/nextconsor-model';
import { PropertyModel, PropertySearchParams } from '../../models/property-model';
import { currentUserModel } from '../../models/user-model';
import {
  deletePropertyServer,
  getAgentPropertiesByIdServer,
  getMyPropertiesServer,
  getPropertyByIdServer,
  likePropertyServer,
  savePropertyServer,
  searchPropertiesServer,
  unlikePropertyServer,
  unsavePropertyServer,
  updatePropertyServer,
  uploadPropertyServer,
  verifyBuyerPropertyServer,
} from './property-service';

export async function getMyProperties(
  cursor?: NextCursorModel,
): Promise<ApiResponse<PropertyModel[]>> {
  const res = await getMyPropertiesServer(cursor);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function getPropertyById(id: string): Promise<ApiResponse<PropertyModel>> {
  const res = await getPropertyByIdServer(id);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function getAgentPropertiesById(
  id: string,
  cursor?: NextCursorModel,
): Promise<ApiResponse<PropertyModel[]>> {
  const res = await getAgentPropertiesByIdServer(id, cursor);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function uploadProperty(formData: FormData): Promise<ApiResponse<PropertyModel>> {
  const res = await uploadPropertyServer(formData);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function verifyBuyerProperty(
  formData: FormData,
  propertyId: string,
): Promise<ApiResponse<currentUserModel>> {
  const res = await verifyBuyerPropertyServer(formData, propertyId);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}
export async function searchProperties(
  params: PropertySearchParams,
): Promise<ApiResponse<PropertyModel[]>> {
  const res = await searchPropertiesServer(params);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function likeProperty(propertyId: string): Promise<ApiResponse<null>> {
  const res = await likePropertyServer(propertyId);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function unlikeProperty(propertyId: string): Promise<ApiResponse<null>> {
  const res = await unlikePropertyServer(propertyId);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function deleteProperty(propertyId: string): Promise<ApiResponse<null>> {
  const res = await deletePropertyServer(propertyId);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function saveProperty(propertyId: string): Promise<ApiResponse<null>> {
  const res = await savePropertyServer(propertyId);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function unsaveProperty(propertyId: string): Promise<ApiResponse<null>> {
  const res = await unsavePropertyServer(propertyId);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function updateProperty(
  propertyId: string,
  formData: FormData,
): Promise<ApiResponse<PropertyModel>> {
  const res = await updatePropertyServer(propertyId, formData);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}
