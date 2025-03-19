import { Component, input, model, output } from '@angular/core';
import { Category } from '../../models/categories.model';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.css',
})
export class CategoryItemComponent {
  category = model<Category | null>(null);
  deleteCategory = output<Category>();
  editCategory = output<Category>();
  isEditEnabled = input(true);
}
