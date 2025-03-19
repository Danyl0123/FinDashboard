import { Component, input } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GoogleChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  ChartType = ChartType;
  dashboardData = input.required<[string, number][]>();
  chartOptions = input.required<{ [key: string]: any }>();
}
