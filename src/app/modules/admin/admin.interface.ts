import { BaseAccount } from '../../interface';

// Admin Interface
export interface IAdmin extends BaseAccount {
  role: 'admin';
  totalSystemBalance: number;
  totalIncome: number;
}
