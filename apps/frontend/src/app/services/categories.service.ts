import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Category } from '../models/categories.model';
import { ApiService } from '../api/api.service';
import { catchError, finalize, of, tap } from 'rxjs';
import { MessageBoxService } from '../shared/services/message-box.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpService = inject(ApiService);
  private readonly messageService = inject(MessageBoxService);
  categoriesList = signal<Category[]>([]);
  categoriesLoader = signal(false);

  getCategoriesList() {
    this.categoriesLoader.set(true);
    return this.httpService.getCategories().pipe(
      tap((res: Category[]) => this.categoriesList.set(res)),
      catchError((e) => {
        this.messageService.sendError(e.message);
        return of(null);
      }),
      finalize(() => this.categoriesLoader.set(false))
    );
  }

  removeCategory(id: number) {
    return this.httpService.removeCategory(id);
  }

  updateCategory(categoryName: string, id: number) {
    return this.httpService.updateCategory(categoryName, id);
  }

  createCategory(categoryName: string) {
    return this.httpService.createCategory(categoryName);
  }
}
