import { NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header-nav',
  standalone: true,
  imports: [NgClass],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.css',
})
export class HeaderNavComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  isAuth = computed(() => this.authService.isLogged());
  currentRoute = signal<string | null>(null);

  constructor() {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.currentRoute.set(this.router.url.split('?')[0].replace('/', ''));
      });
  }

  logOut() {
    this.authService.logOut();
  }

  navigateTo(direct: string) {
    this.router.navigate([direct]);
  }
}
