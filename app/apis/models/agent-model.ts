import { PlanModel } from './plan-model';
import { UserModel } from './user-model';

type VerificationProviderData = unknown;
type SavedPropertyReference = string | { _id?: string };

export interface CreateAgentPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  city: string;
  address: string;
  nationality: string;
  nin: string;
  cacNumber?: string;
  companyName: string;
  yearsOfExperience: number;
  description: string;
  isAgreement: boolean;

  selfie: File;
  ninSlip: File;
  cacDoc?: File;
}

export type UpdateAgentPayload = Partial<
  Omit<CreateAgentPayload, 'selfie' | 'ninSlip' | 'cacDoc'>
> & {
  selfie?: File;
  ninSlip?: File;
  cacDoc?: File;
  selfiePublicId?: string;
  cacDocPublicId?: string;
};

export interface AgentModel {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  city: string;
  address: string;
  nationality: string;
  bvn: string | null;
  user: UserModel;
  nin: string;
  ninSlipUrl: NinSlipUrl;
  verificationData: VerificationData;
  selfieUrl: SelfieUrl;
  cacNumber: string;
  cacDocumentUrl: CacDocumentUrl;
  companyName: string;
  yearsOfExperience: number;
  description: string;
  kycStatus: KycStatus;
  status: string;
  isAgreement: boolean;
  savedProperties: SavedPropertyReference[];
  _id: string;
  planActivatedAt: string;
  isPlanActive: boolean;
  plan: PlanModel;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NinSlipUrl {
  url: string;
  public_id: string;
}

export interface SelfieUrl {
  url: string;
  public_id: string;
}

export interface CacDocumentUrl {
  url: string;
  public_id: string;
}

export interface KycStatus {
  ninVerified: boolean;
  cacVerified: boolean;
  bvnVerified: boolean;
  livenessVerified: boolean;
}

export interface VerificationData {
  nin: NinData;
  cac: CompanyData;
  liveness: VerificationProviderData;
  bvn: VerificationProviderData;
}

export interface CompanyData {
  company_name: string;
  rc_number: string;
  type_of_company: string;
  date_of_registration: string;
  address: string;
  status: string;
  state: string;
  city: string;
  email: string;
  business_number: string;
  lga: string;
  business: string;
}

export interface NinData {
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  photo: string;
  gender: string;
  customer: string;
}
