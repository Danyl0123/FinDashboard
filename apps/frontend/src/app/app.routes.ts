import { Route } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth-page/auth-page.component').then(
        (m) => m.AuthPageComponent
      ),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./pages/transactions-page/transactions-page.component').then(
        (m) => m.TransactionsPageComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories-page/categories-page.component').then(
        (m) => m.CategoriesPageComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/error-page/error-page.component').then(
        (m) => m.ErrorPageComponent
      ),
  },
];
