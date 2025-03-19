import { Component, input } from '@angular/core';
import { Transaction } from '../../models/transactions.model';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-tansaction-list-card',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './tansaction-list-card.component.html',
  styleUrl: './tansaction-list-card.component.css',
})
export class TansactionListCardComponent {
  transactions = input.required<Transaction[]>();
}
