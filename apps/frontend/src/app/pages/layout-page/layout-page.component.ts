import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderNavComponent } from '../../components/header-nav/header-nav.component';

@Component({
  selector: 'app-layout-page',
  standalone: true,
  imports: [RouterOutlet, HeaderNavComponent],
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css',
})
export class LayoutPageComponent {}
