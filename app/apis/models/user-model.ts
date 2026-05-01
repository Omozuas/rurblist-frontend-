import { AgentModel, KycStatus, NinSlipUrl, SelfieUrl, VerificationData } from './agent-model';
import { ProfileImage } from './profile-model';

type SavedPropertyReference = string | { _id?: string };
type PreferredLocation = string | { name?: string; state?: string; city?: string };

export interface currentUserModel {
  user: UserModel;
  homeSeeker: HomeSeekerModel;
  agent: AgentModel;
}

export interface UserModel {
  profileImage: ProfileImage;
  _id: string;
  fullName: string;
  email: string;
  username: string;
  phoneNumber: string;
  roles: string[];
  isLogin: boolean;
}

export interface HomeSeekerModel {
  ninSlipUrl: NinSlipUrl;
  selfieUrl: SelfieUrl;
  kycStatus: KycStatus;
  verificationData: VerificationData;
  _id: string;
  user: string;
  preferredLocations: PreferredLocation[];
  savedProperties: SavedPropertyReference[];
  status: string;
  plan: string | null;
  isPlanActive: boolean;
  planActivatedAt: string;
  nin: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
