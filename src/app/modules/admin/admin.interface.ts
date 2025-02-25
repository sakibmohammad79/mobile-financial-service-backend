import mongoose from 'mongoose';
import { BaseAccount } from '../../interface';

export interface IAdmin extends BaseAccount {
  role: 'admin';
  totalSystemBalance: number;
  transactions?: mongoose.Types.ObjectId[];
  totalIncome: number;
}
