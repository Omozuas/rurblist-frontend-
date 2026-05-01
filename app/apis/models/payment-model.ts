import { AgentModel } from './agent-model';
import { PlanModel } from './plan-model';
import { PropertyModel } from './property-model';
import { UserModel } from './user-model';

export interface PaymentModel {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaymentDetailModel {
  _id: string;
  user: UserModel;
  agent: AgentModel;
  property: PropertyModel;
  tour: string;
  paymentFor: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: string;
  plan: PlanModel | null;
  reference: string;
  receiptSent: boolean;
  createdAt: string;
  metadata: MetadataModel;
  updatedAt: string;
  verification: string;
  __v: number;
  paidAt: string;
  transactionId: string;
}

export interface MetadataModel {
  paymentId: string;
  type: string;
  userName: string;
  userPhone: string;
  propertyId: string;
  planId: string;
  enscrowFee: string;
  agentFee: string;
  propertyPrice: string;
  referrer: string;
}
