import { BaseAccount, Transaction } from '../../interface';

export interface IAgent extends BaseAccount {
  role: 'agent';
  isVerified: boolean;
  transactions?: Transaction[];
  totalIncome: number;
}
