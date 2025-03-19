import { Component, computed, input, output } from '@angular/core';
import { TableData, TableHeader } from '../../models/shared-table.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-table-with-filters',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './table-with-filters.component.html',
  styleUrl: './table-with-filters.component.css',
})
export class TableWithFiltersComponent {
  tableHeaders = input.required<TableHeader[]>();
  tableData = input.required<TableData[]>();
  dateTableHeaders = input<string[]>([]);
  isDeleteBtnEnabled = input<boolean>(false);
  isEditBtnEnabled = input<boolean>(false);
  deleteRowHandler = output();
  editRowHandler = output();
  page = 1;
  itemsPerPage = input(10);
  paginatedData = computed(() => {
    const start = (this.page - 1) * this.itemsPerPage();
    return this.tableData().slice(start, start + this.itemsPerPage());
  });
  isDateField(value: string): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  deleteRow(row: any) {
    this.deleteRowHandler.emit(row);
  }

  editRow(row: any) {
    this.editRowHandler.emit(row);
  }
}
