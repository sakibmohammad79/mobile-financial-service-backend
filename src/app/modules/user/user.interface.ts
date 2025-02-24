import { BaseAccount, Transaction } from '../../interface';
// User Interface
export interface IUser extends BaseAccount {
  role: 'user';
  transactions: Transaction[];
}
