import { AgentModel } from './agent-model';
import { PaymentDetailModel } from './payment-model';
import { PropertyModel } from './property-model';
import { UserModel } from './user-model';

export type ApiDate = string | null;
export type CloudinaryValue = string | null;

export interface VerficationModel {
  currentStage: CurrentStage;
  certificate: Certificate;
  inspection: Inspection;
  _id: string;
  user: UserModel;
  agent: AgentModel;
  property: PropertyModel;
  payment: PaymentDetailModel;
  status: string;
  documents: DocumentModel[];
  timeline: TimelineModel[];
  fundsReleased: boolean;
  fundsReleasedAt: ApiDate;
  isCompleted: boolean;
  completedAt: ApiDate;
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CurrentStage {
  title: string;
  description: string;
  estimatedCompletion: string;
}

export interface Certificate {
  url: CloudinaryValue;
  public_id: CloudinaryValue;
  certificateId: string;
  issuedAt: ApiDate;
}

export interface Inspection {
  scheduledAt: ApiDate;
  completedAt: ApiDate;
  note: string;
}

export interface DocumentModel {
  file: FileModel;
  name: string;
  status: string;
  note: string;
  submittedAt: ApiDate;
  verifiedAt: ApiDate;
  rejectedAt: ApiDate;
  _id: string;
}

export interface FileModel {
  url: CloudinaryValue;
  public_id: CloudinaryValue;
}

export interface TimelineModel {
  title: string;
  description: string;
  status: string;
  date: string;
  _id: string;
}
