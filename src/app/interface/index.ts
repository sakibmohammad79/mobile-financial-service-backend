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
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Interfac
interface Transaction {
  id: string;
  senderId?: mongoose.Types.ObjectId; // Optional for Cash-In
  receiverId?: mongoose.Types.ObjectId; // Optional for Cash-Out
  // senderId?: string; // Not required for cash-in
  // receiverId?: string; // Not required for cash-out
  amount: number;
  type: 'SendMoney' | 'CashIn' | 'CashOut';
  fee: number;
  timestamp: Date;
}

export { BaseAccount, Transaction };
