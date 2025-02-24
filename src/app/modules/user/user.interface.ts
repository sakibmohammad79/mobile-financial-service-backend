import mongoose from 'mongoose';
import { BaseAccount } from '../../interface';

export interface IUser extends BaseAccount {
  role: 'user';
  transactions?: mongoose.Types.ObjectId[]; // Store only references
}
