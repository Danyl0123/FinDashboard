import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Transaction } from '../models/transactions.model';
import { catchError, finalize, of, take, tap } from 'rxjs';
import { MessageBoxService } from '../shared/services/message-box.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly httpService = inject(ApiService);
  private readonly messageService = inject(MessageBoxService);

  isTransactionsLoaded = signal(false);
  transactions = signal<Transaction[]>([]);

  transactionDashboardData = computed(() =>
    Object.entries(
      this.transactions().reduce(
        (acc, item) => {
          if (item.type === 'expense') {
            acc['Total Expense'] += item.amount;
          } else {
            acc['Total Income'] += item.amount;
          }
          return acc;
        },
        { 'Total Income': 0, 'Total Expense': 0 }
      )
    )
  );

  addNewTransaction(transaction: any) {
    return this.httpService.createNewTransaction(transaction).pipe(
      take(1),
      tap(() => this.getTransactionsList().subscribe())
    );
  }

  getTransactionsList() {
    this.isTransactionsLoaded.set(false);
    return this.httpService.getTransactionsList().pipe(
      tap((response) => {
        this.transactions.set(response);
      }),
      catchError((e) => {
        this.messageService.sendError(e.message);
        return of([]);
      }),
      finalize(() => this.isTransactionsLoaded.set(true))
    );
  }

  deleteTransaction(id: number) {
    return this.httpService.removeTransaction(id);
  }

  updateTransaction(transaction: Transaction, id: number) {
    return this.httpService.updateTransaction(transaction, id);
  }
}
