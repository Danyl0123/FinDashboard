import { CommonModule } from '@angular/common';
import { Component, inject, Input, output, TemplateRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css',
})
export class EditModalComponent {
  protected readonly modalService = inject(NgbActiveModal);
  @Input() contentTemplate!: TemplateRef<any>;
  @Input() title!: string;
  confirmEdit = output();
}
