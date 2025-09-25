import { computed, inject, Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from '../models/categories.model';
import { Transaction } from '../models/transactions.model';
import { environment } from '../../enviroments/enviroments';
import { urlConfig } from 'src/enviroments/url-config';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  baseUrl = computed(() => urlConfig.backendUrl);
  readonly bearer = this.authService.getToken();

  getCategories() {
    return this.http.get<Category[]>(`${this.baseUrl()}/categories`);
  }

  removeCategory(id: number) {
    return this.http.delete(`${this.baseUrl()}/categories/category/${id}`);
  }

  updateCategory(category: string, id: number) {
    return this.http.patch(`${this.baseUrl()}/categories/${id}`, {
      title: category,
    });
  }

  createCategory(category: string) {
    return this.http.post(`${this.baseUrl()}/categories`, {
      title: category,
    });
  }

  createNewTransaction(transaction: any) {
    return this.http.post(`${this.baseUrl()}/transaction`, transaction);
  }

  getTransactionsList() {
    return this.http.get<Transaction[]>(`${this.baseUrl()}/transaction`);
  }

  removeTransaction(id: number) {
    return this.http.delete(`${this.baseUrl()}/transaction/transaction/${id}`);
  }

  updateTransaction(transaction: Transaction, id: number) {
    return this.http.patch(
      `${this.baseUrl()}/transaction/transaction/${id}`,
      transaction
    );
  }
}
