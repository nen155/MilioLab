import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/errors';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule],
  template: `
    <header class="page-head">
      <div>
        <h1>Mi cuenta</h1>
        <p>{{ auth.user()?.email }}</p>
      </div>
    </header>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }
    @if (notice()) {
      <div class="alert alert-ok">{{ notice() }}</div>
    }

    <div class="card" style="max-width: 560px">
      <h2>Cambiar contraseña</h2>
      <p class="muted small">
        Al cambiarla se cierran las sesiones abiertas en otros dispositivos.
      </p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label for="current">Contraseña actual</label>
          <input id="current" class="input" type="password" autocomplete="current-password" formControlName="current_password" />
        </div>

        <div class="field">
          <label for="password">Nueva contraseña</label>
          <input id="password" class="input" type="password" autocomplete="new-password" formControlName="password" />
          <span class="hint">Mínimo 8 caracteres.</span>
        </div>

        <div class="field">
          <label for="confirmation">Repite la nueva contraseña</label>
          <input id="confirmation" class="input" type="password" autocomplete="new-password" formControlName="password_confirmation" />
        </div>

        <button class="btn btn-primary" type="submit" [disabled]="saving()">
          {{ saving() ? 'Guardando…' : 'Cambiar contraseña' }}
        </button>
      </form>
    </div>
  `,
})
export class AccountComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    current_password: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (value.password !== value.password_confirmation) {
      this.error.set('Las contraseñas nuevas no coinciden.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    this.api.changePassword(value).subscribe({
      next: () => {
        this.saving.set(false);
        this.form.reset({ current_password: '', password: '', password_confirmation: '' });
        this.flash('Contraseña actualizada.');
      },
      error: (error) => {
        this.saving.set(false);
        this.error.set(errorMessage(error, 'No se pudo cambiar la contraseña.'));
      },
    });
  }

  private flash(message: string): void {
    this.notice.set(message);
    setTimeout(() => this.notice.set(null), 3000);
  }
}
