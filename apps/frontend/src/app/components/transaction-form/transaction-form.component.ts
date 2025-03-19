import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Category } from '../../models/categories.model';
import { TransactionsService } from '../../services/transactions.service';
import { catchError, of, tap } from 'rxjs';
import { MessageBoxService } from '../../shared/services/message-box.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgSelectModule, NgxMaskDirective],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css',
})
export class TransactionFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly transactionService = inject(TransactionsService);
  private readonly messageService = inject(MessageBoxService);
  private readonly destroyRef = inject(DestroyRef);
  private router = inject(Router);
  transactionForm!: FormGroup;

  categories = input.required<Category[] | null>();

  initTransctionForm() {
    this.transactionForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', Validators.min(0)],
      categoryId: [null, Validators.required],
      type: ['expense', Validators.required],
    });
  }

  ngOnInit() {
    this.initTransctionForm();
  }

  navigateToCategoriesPage() {
    this.router.navigate(['categories']);
  }

  createNewTransaction() {
    const formValues = this.transactionForm.getRawValue();

    const transactionData = {
      title: formValues.title.trim(),
      amount: +formValues.amount,
      type: formValues.type,
      category: { id: formValues.categoryId },
    };
    this.transactionService
      .addNewTransaction(transactionData)
      .pipe(
        tap(() => {
          this.messageService.sendInfo('Successfully added!');
          this.transactionForm.reset();
        }),
        catchError((e) => {
          this.messageService.sendError(e.message);
          return of(null);
        })
      )
      .subscribe();
  }
}
