import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DashboardComponent } from '../../shared/components/dashboard/dashboard.component';
import { TransactionsService } from '../../services/transactions.service';
import {
  chartOptions,
  transactionstableHeaders,
} from '../transactions-page/trsansactions-page.headers';
import { TansactionListCardComponent } from '../../components/tansaction-list-card/tansaction-list-card.component';
import { CategoriesService } from '../../services/categories.service';
import { CategoryItemComponent } from '../../components/category-item/category-item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin } from 'rxjs';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { Router } from '@angular/router';
import { TableWithFiltersComponent } from '../../shared/components/table-with-filters/table-with-filters.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    DashboardComponent,
    TansactionListCardComponent,
    TansactionListCardComponent,
    CategoryItemComponent,
    LoaderComponent,
    TableWithFiltersComponent,
    NgClass,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  tableHeaders = computed(() => transactionstableHeaders);
  dashboardData = computed(() =>
    this.transactionsService.transactionDashboardData()
  );
  chartOptions = computed(() => chartOptions);
  transactions = computed(() => this.transactionsService.transactions());
  totalIncome = computed(() => this.dashboardData()[0][1]);
  totalExpense = computed(() => this.dashboardData()[1][1]);
  categoryList = computed(() => this.categoriesService.categoriesList());
  isLoaded = signal(true);
  ngOnInit(): void {
    if (this.transactions().length === 0 || this.categoryList().length === 0) {
      this.isLoaded.set(false);
      forkJoin([
        this.categoriesService.getCategoriesList(),
        this.transactionsService.getTransactionsList(),
      ])
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.isLoaded.set(true))
        )
        .subscribe();
    }
  }

  navigateToCategoriesPage() {
    this.router.navigate(['/categories'], {
      queryParams: { openModal: 'true' },
    });
  }

  navigateToTransactionsPage() {
    this.router.navigate(['/transactions']);
  }
}
