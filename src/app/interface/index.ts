import mongoose from 'mongoose';

// Common interface for all roles
interface BaseAccount {
  id: string;
  name: string;
  pin: string;
  mobileNumber: string;
  email: string;
  nid: string;
  balance: number;
  role: 'user' | 'agent' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Agent Interface
interface Agent extends BaseAccount {
  role: 'agent';
  isVerified: boolean;
  transactions: Transaction[];
  totalIncome: number;
}

// Admin Interface
interface Admin extends BaseAccount {
  role: 'admin';
  totalSystemBalance: number;
  totalIncome: number;
}

// Transaction Interface
interface Transaction {
  id: string;
  senderId?: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  //   senderId?: string; // Not required for cash-in
  //   receiverId?: string; // Not required for cash-out
  amount: number;
  type: 'SendMoney' | 'CashIn' | 'CashOut';
  fee: number;
  timestamp: Date;
}

export { BaseAccount, Agent, Admin, Transaction };
