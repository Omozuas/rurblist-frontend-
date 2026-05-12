'use server';

import { ApiResponse } from '../../base-response';
import { api } from '../../call-apis';
import { NextCursorModel } from '../../models/nextconsor-model';
import { PropertyModel, PropertySearchParams } from '../../models/property-model';
import { currentUserModel } from '../../models/user-model';
import { buildCursorQuery, DEFAULT_PAGE_LIMIT } from '../../utils/build-cursor-query';

export async function getMyPropertiesServer(
  cursor?: NextCursorModel,
): Promise<ApiResponse<PropertyModel[]>> {
  const res = await api.authGet<PropertyModel[]>(
    `/property/my-properties${buildCursorQuery(cursor)}`,
  );

  return res;
}

export async function getPropertyByIdServer(id: string): Promise<ApiResponse<PropertyModel>> {
  const res = await api.authGet<PropertyModel>(`/property/${id}`);

  return res;
}

export async function getAgentPropertiesByIdServer(
  id: string,
  cursor?: NextCursorModel,
): Promise<ApiResponse<PropertyModel[]>> {
  const res = await api.authGet<PropertyModel[]>(
    `/property/agent-properties/${id}${buildCursorQuery(cursor)}`,
  );

  return res;
}

export async function uploadPropertyServer(
  formData: FormData,
): Promise<ApiResponse<PropertyModel>> {
  const res = await api.authPost<PropertyModel>('/property', formData);

  return res;
}

export async function verifyBuyerPropertyServer(
  formData: FormData,
  propertyId: string,
): Promise<ApiResponse<currentUserModel>> {
  const res = await api.authPost<currentUserModel>(
    `/property/${propertyId}/verify-buyer`,
    formData,
  );

  return res;
}

function buildQuery(params: PropertySearchParams): string {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.type) query.set('type', params.type);
  if (params.status) query.set('status', params.status);
  if (params.minPrice) query.set('minPrice', String(params.minPrice));
  if (params.maxPrice) query.set('maxPrice', String(params.maxPrice));
  if (params.bedrooms) query.set('bedrooms[gte]', String(params.bedrooms));
  if (params.bathrooms) query.set('bathrooms[gte]', String(params.bathrooms));
  if (params.state) query.set('location.state', params.state);
  if (params.city) query.set('location.city', params.city);
  if (params.sort) query.set('sort', params.sort);
  if (params.page) query.set('page', String(params.page));
  query.set('limit', String(params.limit ?? DEFAULT_PAGE_LIMIT));
  if (params.cursor) query.set('cursor', params.cursor);

  return query.toString();
}

export async function searchPropertiesServer(
  params: PropertySearchParams,
): Promise<ApiResponse<PropertyModel[]>> {
  const query = buildQuery(params);
  const res = await api.authGet<PropertyModel[]>(`/property?${query}`);

  return res;
}

export async function likePropertyServer(propertyId: string): Promise<ApiResponse<null>> {
  const res = await api.authPatch<null>(`/property/${propertyId}/like`, {});

  return res;
}

export async function unlikePropertyServer(propertyId: string): Promise<ApiResponse<null>> {
  const res = await api.authPatch<null>(`/property/${propertyId}/unlike`);

  return res;
}

export async function deletePropertyServer(propertyId: string): Promise<ApiResponse<null>> {
  const res = await api.authDelete<null>(`/property/${propertyId}`);

  return res;
}

export async function savePropertyServer(propertyId: string): Promise<ApiResponse<null>> {
  const res = await api.authPatch<null>(`/user/${propertyId}/save`, {});

  return res;
}

export async function unsavePropertyServer(propertyId: string): Promise<ApiResponse<null>> {
  const res = await api.authPatch<null>(`/user/${propertyId}/save`);

  return res;
}

export async function updatePropertyServer(
  propertyId: string,
  formData: FormData,
): Promise<ApiResponse<PropertyModel>> {
  const res = await api.authPatch<PropertyModel>(`/property/${propertyId}`, formData);

  return res;
}
