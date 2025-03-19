import { Category } from './categories.model';

export interface Transaction {
  id: number;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
}
