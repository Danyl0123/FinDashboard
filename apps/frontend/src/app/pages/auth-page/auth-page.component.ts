import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  isLogin = signal(true);
  form: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        const token = params['token'];
        this.authService.setToken(token);
        this.router.navigate(['/']);
      }
    });

    this.form = this.fb.group({
      userLogin: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  loginWithGoogleService() {
    this.authService.loginWithGoogle();
  }

  onSubmit() {
    if (this.form.valid) {
      const { userLogin, userPassword } = this.form.value;
      if (this.isLogin()) {
        this.authService.login({ email: userLogin, password: userPassword });
      } else {
        this.authService.registration({
          email: userLogin,
          password: userPassword,
        });
      }
    }
  }
}
