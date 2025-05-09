import mongoose from 'mongoose';

// Common interface for all roles
interface BaseAccount {
  _id?: mongoose.Types.ObjectId; // MongoDB automatically generates an ObjectId
  name: string;
  pin: string;
  mobileNumber: string;
  email: string;
  nid: string;
  balance: number;
  role: 'user' | 'agent' | 'admin';
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Transaction Interface
interface Transaction {
  _id?: mongoose.Types.ObjectId;
  senderId?: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  senderType: 'Admin' | 'User';
  amount: number;
  type: 'sendmoney' | 'cashin' | 'cashout' | 'addmoney';
  fee: number;
  timestamp?: Date;
}
export { BaseAccount, Transaction };
