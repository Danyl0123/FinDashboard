import {
  Component,
  computed,
  DestroyRef,
  inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';
import { CategoriesService } from '../../services/categories.service';
import { TableWithFiltersComponent } from '../../shared/components/table-with-filters/table-with-filters.component';
import { TransactionsService } from '../../services/transactions.service';
import { catchError, of, tap } from 'rxjs';
import { MessageBoxService } from '../../shared/services/message-box.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  chartOptions,
  transactionstableHeaders,
} from './trsansactions-page.headers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditModalComponent } from '../../shared/components/edit-modal/edit-modal.component';
import { Transaction } from '../../models/transactions.model';
import { NonAvailabilityBlockComponent } from '../../shared/components/non-availability-block/non-availability-block.component';
import { DashboardComponent } from '../../shared/components/dashboard/dashboard.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    TransactionFormComponent,
    TableWithFiltersComponent,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NonAvailabilityBlockComponent,
    DashboardComponent,
    LoaderComponent,
  ],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.css',
})
export class TransactionsPageComponent {
  private readonly categoriesService = inject(CategoriesService);
  private readonly transactionsService = inject(TransactionsService);
  private readonly messageService = inject(MessageBoxService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  protected modalService = inject(NgbModal);

  categories = computed(() => this.categoriesService.categoriesList());
  transactions = computed(() => this.transactionsService.transactions());
  tableHeaders = computed(() => transactionstableHeaders);
  editForm!: FormGroup;
  chartOptions = chartOptions;
  transactionData = computed(() =>
    this.transactionsService.transactionDashboardData()
  );
  @ViewChild('editFormTemplate') editeTemplate!: TemplateRef<any>;

  get loader() {
    return this.transactionsService.isTransactionsLoaded();
  }

  initEditForm() {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      amount: [null, [Validators.required, Validators.min(1)]],
      category: [null, Validators.required],
      type: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getTransactionsList();
    if (this.categories().length === 0)
      this.categoriesService
        .getCategoriesList()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
  }

  getTransactionsList() {
    this.transactionsService
      .getTransactionsList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  removeTransaction(id: number) {
    this.transactionsService
      .deleteTransaction(id)
      .pipe(
        tap(() => {
          this.transactionsService.transactions.update((categories) =>
            categories.filter((cat) => cat.id !== id)
          );
          this.messageService.sendInfo('Successfully deleted!');
        }),
        catchError((e) => {
          this.messageService.sendError(e.message);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  deleteTransactionHandler(transaction: any) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      animation: true,
      backdrop: true,
    });
    modalRef.componentInstance.title = transaction.title;
    modalRef.componentInstance.confirmText =
      'Are you sure to delete this transaction?';
    modalRef.componentInstance.confirm.subscribe(() => {
      this.removeTransaction(transaction.id);
      modalRef.close();
    });
  }

  editTransaction(transaction: any) {
    this.initEditForm();
    this.editForm.patchValue({
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category.id,
      type: transaction.type,
    });
    const modalRef = this.modalService.open(EditModalComponent, {
      animation: true,
      backdrop: true,
      centered: true,
    });
    modalRef.componentInstance.title = transaction.title;
    modalRef.componentInstance.contentTemplate = this.editeTemplate;

    modalRef.componentInstance.confirmEdit.subscribe(() => {
      if (this.editForm.valid) {
        this.updateCategory(this.editForm.getRawValue(), transaction.id);
        modalRef.close();
      } else {
        this.messageService.sendError('Form is not correct.');
      }
    });
  }

  updateCategory(transaction: Transaction, id: number) {
    this.transactionsService
      .updateTransaction(transaction, id)
      .pipe(
        tap(() => {
          this.messageService.sendInfo('Succesfully updated!');

          this.transactionsService.transactions.update((transactions) =>
            transactions.map((trans) =>
              trans.id === id
                ? {
                    ...trans,
                    ...transaction,
                    category: {
                      ...trans.category,
                      id: transaction.category as unknown as number,
                    },
                  }
                : trans
            )
          );
        }),
        catchError((e) => {
          this.messageService.sendError(e.message);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
