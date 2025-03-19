import { Component, input } from '@angular/core';

@Component({
  selector: 'app-non-availability-block',
  standalone: true,
  imports: [],
  templateUrl: './non-availability-block.component.html',
  styleUrl: './non-availability-block.component.css',
})
export class NonAvailabilityBlockComponent {
  text = input.required<string>();
}
