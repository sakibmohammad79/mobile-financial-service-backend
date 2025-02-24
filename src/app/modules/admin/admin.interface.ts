import { BaseAccount } from '../../interface';

export interface IAdmin extends BaseAccount {
  role: 'admin';
  totalSystemBalance: number;
  totalIncome: number;
}
