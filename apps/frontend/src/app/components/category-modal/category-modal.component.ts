import { Component, inject, Input, input, model, output } from '@angular/core';
import { Category } from '../../models/categories.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category-moda',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css',
})
export class CategoryModaComponent {
  protected readonly modalService = inject(NgbActiveModal);
  @Input() category: Category | null = null;
  @Input() type: 'edit' | 'create' = 'create';
  newCategory = model<string>('');
  saveChanges = output<string>();

  ngOnInit() {
    if (this.type === 'edit') {
      this.newCategory.set(this.category!.title);
    }
  }
}
