import { AgentModel } from './agent-model';
import { CommentModel } from './comment-model';
import { ImageModel } from './image-model';
import { LocationModel } from './location-model';

type UserReference = string | { _id?: string };

// types/property.ts
export type Property = {
  id: string;
  title: string;
  price: number;
  type: 'rent' | 'sale';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
};

export interface PropertyModel {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  agentFee: number;
  paymentFrequency: string;
  images: ImageModel[];
  location: LocationModel;
  owner: AgentModel;
  likes: UserReference[];
  amenities: string[];
  furnishingStatus: string;
  likesCount: number;
  comments: CommentModel[];
  views: number;
  verificationStatus: string;
  isAvailable: boolean;
  isSold: boolean;
  priorityLevel: number;
  slug: string;
  trendingScore: number;
  createdAt: string;
  updatedAt: string;
  unlikes: UserReference[];
  unlikesCount: number;
  commentsCount: number;
  inspectionFee: number;
  __v: number;
}

export type PropertySearchParams = {
  search?: string;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  state?: string;
  city?: string;
  sort?: string;
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  cursor?: string;
};
