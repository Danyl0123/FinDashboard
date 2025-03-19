import { Component, inject, Input, input, output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
})
export class ConfirmModalComponent {
  protected modalService = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() confirmText!: string;
  confirm = output();
}
