import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { Category } from '../../core/models';

@Component({
  selector: 'app-categories',
  imports: [ReactiveFormsModule],
  template: `
    <header class="page-head">
      <div>
        <h1>Categorías</h1>
        <p>Agrupan las entradas del blog (Noticias, Tutoriales…).</p>
      </div>
    </header>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }

    <div class="grid grid-2">
      <div class="card">
        <h2>Nueva categoría</h2>
        <form [formGroup]="form" (ngSubmit)="create()">
          <div class="field">
            <label for="name">Nombre</label>
            <input id="name" class="input" formControlName="name" />
          </div>
          <div class="field">
            <label for="name_en">Nombre en inglés</label>
            <input id="name_en" class="input" formControlName="name_en" />
          </div>
          <div class="field">
            <label for="description">Descripción (opcional)</label>
            <textarea id="description" class="textarea" formControlName="description" rows="2"></textarea>
          </div>
          <div class="field">
            <label for="description_en">Descripción en inglés (opcional)</label>
            <textarea id="description_en" class="textarea" formControlName="description_en" rows="2"></textarea>
          </div>
          <button class="btn btn-primary" type="submit" [disabled]="saving()">Añadir</button>
        </form>
      </div>

      <div class="card">
        <h2>Existentes</h2>

        @if (loading()) {
          <p class="muted">Cargando…</p>
        } @else if (categories().length === 0) {
          <p class="empty">No hay categorías.</p>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>URL</th>
                  <th>Entradas</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (category of categories(); track category.id) {
                  <tr>
                    <td>
                      {{ category.name }}
                      @if (category.name_en) {
                        <span class="muted small">· {{ category.name_en }}</span>
                      }
                    </td>
                    <td class="muted small">{{ category.slug }}</td>
                    <td class="muted">{{ category.posts_count ?? 0 }}</td>
                    <td class="actions">
                      <button class="btn btn-sm" type="button" (click)="rename(category)">Renombrar</button>
                      <button class="btn btn-sm" type="button" (click)="renameEn(category)">Nombre EN</button>
                      <button class="btn btn-sm btn-danger" type="button" (click)="remove(category)">Borrar</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class CategoriesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    name_en: [''],
    description: [''],
    description_en: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  protected create(): void {
    if (this.form.invalid) {
      return;
    }

    this.saving.set(true);

    this.api.createCategory(this.form.getRawValue()).subscribe({
      next: (category) => {
        this.categories.update((items) => [...items, category].sort((a, b) => a.name.localeCompare(b.name)));
        this.form.reset({ name: '', name_en: '', description: '', description_en: '' });
        this.saving.set(false);
      },
      error: (error) => {
        this.saving.set(false);
        this.error.set(errorMessage(error));
      },
    });
  }

  protected rename(category: Category): void {
    const name = window.prompt('Nuevo nombre', category.name);

    if (!name || name === category.name) {
      return;
    }

    this.api.updateCategory(category.id, { name }).subscribe({
      next: (updated) =>
        this.categories.update((items) => items.map((item) => (item.id === updated.id ? updated : item))),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  protected renameEn(category: Category): void {
    const nameEn = window.prompt('Nombre en inglés', category.name_en ?? '');

    if (nameEn === null || nameEn === (category.name_en ?? '')) {
      return;
    }

    this.api.updateCategory(category.id, { name_en: nameEn || null }).subscribe({
      next: (updated) =>
        this.categories.update((items) => items.map((item) => (item.id === updated.id ? updated : item))),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  protected remove(category: Category): void {
    if (!window.confirm(`¿Borrar «${category.name}»? Las entradas se quedarán sin categoría.`)) {
      return;
    }

    this.api.deleteCategory(category.id).subscribe({
      next: () => this.categories.update((items) => items.filter((item) => item.id !== category.id)),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  private load(): void {
    this.api.categories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });
  }
}
