import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, UserAuth } from './auth.model';
import { MessageBoxService } from '../shared/services/message-box.service';
import { catchError, of, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../enviroments/enviroments';
import { urlConfig } from 'src/enviroments/url-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly cookieService = inject(CookieService);
  private readonly http = inject(HttpClient);
  private readonly route = inject(Router);
  private readonly messageService = inject(MessageBoxService);
  private readonly destroyRef = inject(DestroyRef);
  private apiUrl = computed(() => urlConfig.backendUrl);
  isAuth = signal(false);

  constructor() {
    this.syncAuthState();
  }

  private syncAuthState() {
    const hasToken = this.cookieService.check('auth_token');
    this.isAuth.set(hasToken);
  }

  login(user: User) {
    return this.http
      .post<UserAuth>(this.apiUrl() + '/auth/login', user)
      .pipe(
        catchError((err) => {
          this.messageService.sendError(err.message);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((response) => {
        if (response) {
          this.setToken(response.token);

          this.route.navigate(['']);
        }
      });
  }

  registration(user: User) {
    return this.http
      .post<{ token: string }>(this.apiUrl() + '/user', user)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          this.messageService.sendError(err.message);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.setToken(response.token);
          this.route.navigate(['']);
        }
      });
  }

  logOut() {
    this.cookieService.delete('auth_token');
    this.isAuth.set(false);
    this.route.navigate(['login']).then(() => {
      window.location.reload();
    });
  }

  getToken() {
    return this.cookieService.get('auth_token');
  }

  isLogged() {
    return this.isAuth();
  }

  loginWithGoogle() {
    window.location.href = `${this.apiUrl()}/auth/google`;
  }

  setToken(token: string) {
    this.cookieService.set('auth_token', token, {
      path: '/',
      sameSite: 'None',
      secure: true,
    });
    this.isAuth.set(true);
    this.messageService.sendInfo('Успішно авторизовано');
  }
}
