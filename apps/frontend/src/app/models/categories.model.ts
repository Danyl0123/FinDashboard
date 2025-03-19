import { Transaction } from './transactions.model';

export interface Category {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
}
