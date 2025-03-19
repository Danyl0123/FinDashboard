import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { CategoryItemComponent } from '../../components/category-item/category-item.component';
import { catchError, of, tap } from 'rxjs';
import { MessageBoxService } from '../../shared/services/message-box.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../models/categories.model';
import { CategoryModaComponent } from '../../components/category-modal/category-modal.component';
import { NonAvailabilityBlockComponent } from '../../shared/components/non-availability-block/non-availability-block.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    CategoryItemComponent,
    NonAvailabilityBlockComponent,
    LoaderComponent,
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css',
})
export class CategoriesPageComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly messageService = inject(MessageBoxService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modalService = inject(NgbModal);
  private readonly route = inject(ActivatedRoute);
  categoriesList = computed(() => this.categoriesService.categoriesList());
  @ViewChild('confirm') confirm!: TemplateRef<any>;
  body = '';

  ngOnInit(): void {
    this.categoriesService
      .getCategoriesList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.route.queryParams.subscribe((params) => {
      if (params['openModal'] === 'true') {
        this.addCategory();
      }
    });
  }

  get loader() {
    return this.categoriesService.categoriesLoader();
  }

  deleteCategory(category: Category) {
    this.body = category.title;
    const modalRef: NgbModalRef = this.modalService.open(this.confirm, {
      centered: true,
      size: 'md',
      windowClass: 'modal-window',
      backdrop: 'static',
      animation: true,
    });
    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          this.removeCategory(category.id);
        }
      })
      .catch(() => {});
  }

  private removeCategory(id: number) {
    this.categoriesService
      .removeCategory(id)
      .pipe(
        tap(() => {
          this.categoriesService.categoriesList.update((categories) =>
            categories!.filter((category) => category.id !== id)
          );
          this.messageService.sendInfo('Category successfully deleted!');
        }),
        catchError((e) => {
          this.messageService.sendError('Failed to delete category.');
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  editCategory(category: Category) {
    const oldCategory = { ...category };
    const modalRef = this.modalService.open(CategoryModaComponent, {
      centered: true,
      size: 'md',
      windowClass: 'modal-window',
      backdrop: 'static',
      animation: true,
    });
    modalRef.componentInstance.category = { ...category };
    modalRef.componentInstance.type = 'edit';

    modalRef.componentInstance.saveChanges.subscribe((newCategory: string) => {
      this.updateCategory(newCategory, oldCategory, modalRef);
    });
  }

  private readonly updateCategory = (
    categoryName: string,
    oldCategory: Category,
    modalRef: NgbModalRef
  ) => {
    this.categoriesService
      .updateCategory(categoryName, oldCategory.id)
      .pipe(
        tap(() => {
          this.categoriesService.categoriesList.update((categories) =>
            categories!.map((categ) => {
              if (categ.id === oldCategory.id) {
                categ.title = categoryName;
              }
              return categ;
            })
          );
          this.messageService.sendInfo(
            'The category has been successfully edited!'
          );
          modalRef.close();
        }),
        catchError((e) => {
          this.categoriesService.categoriesList.update((categories) =>
            categories!.map((categ) => {
              if (categ.id === oldCategory.id) {
                categ.title = oldCategory.title;
              }
              return categ;
            })
          );
          this.messageService.sendError('Unable to edit category.');
          modalRef.close();
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  };

  addCategory() {
    const modalRef = this.modalService.open(CategoryModaComponent, {
      centered: true,
      size: 'md',
      windowClass: 'modal-window',
      backdrop: 'static',
      animation: true,
    });

    modalRef.componentInstance.type = 'create';

    modalRef.componentInstance.saveChanges.subscribe((newCategory: string) => {
      this.createCategory(newCategory, modalRef);
    });
  }

  createCategory(categoryName: string, modalRef: NgbModalRef) {
    this.categoriesService
      .createCategory(categoryName)
      .pipe(
        tap(() => {
          this.categoriesService
            .getCategoriesList()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
          this.messageService.sendInfo(
            'The category has been successfully created!'
          );
          modalRef.close();
        }),
        catchError((e) => {
          this.messageService.sendError('Couldn`t create a category.');
          modalRef.close();
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
