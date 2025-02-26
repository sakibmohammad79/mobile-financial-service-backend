import mongoose from 'mongoose';
import { BaseAccount } from '../../interface';

export interface IAgent extends BaseAccount {
  role: 'agent';
  isVerified: boolean;
  transactions?: mongoose.Types.ObjectId[];
  totalIncome: number;
}

import { Document, Types } from 'mongoose';

export interface IRechargeRequest extends Document {
  agentId: Types.ObjectId;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
