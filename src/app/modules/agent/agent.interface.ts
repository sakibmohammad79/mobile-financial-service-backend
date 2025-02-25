import mongoose from 'mongoose';
import { BaseAccount } from '../../interface';

export interface IAgent extends BaseAccount {
  role: 'agent';
  isVerified: boolean;
  transactions?: mongoose.Types.ObjectId[];
  totalIncome: number;
}
