import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/errors';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="card login-card">
        <div class="login-brand">
          <span class="mark">M</span>
          <span>MilioLab</span>
        </div>

        <h1>Entrar al panel</h1>
        <p class="muted small">Escribe tus credenciales para gestionar el contenido.</p>

        @if (error()) {
          <div class="alert alert-error">{{ error() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="field">
            <label for="email">Correo</label>
            <input
              id="email"
              class="input"
              type="email"
              autocomplete="username"
              formControlName="email"
            />
          </div>

          <div class="field">
            <label for="password">Contraseña</label>
            <input
              id="password"
              class="input"
              type="password"
              autocomplete="current-password"
              formControlName="password"
            />
          </div>

          <button class="btn btn-primary" type="submit" [disabled]="loading()">
            {{ loading() ? 'Entrando…' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(errorMessage(error, 'No se pudo iniciar sesión.'));
      },
    });
  }
}
