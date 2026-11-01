import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { Tag } from '../../core/models';

@Component({
  selector: 'app-tags',
  imports: [ReactiveFormsModule],
  template: `
    <header class="page-head">
      <div>
        <h1>Etiquetas</h1>
        <p>Temas sueltos que pueden compartir varias entradas.</p>
      </div>
    </header>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }

    <div class="grid grid-2">
      <div class="card">
        <h2>Nueva etiqueta</h2>
        <form [formGroup]="form" (ngSubmit)="create()">
          <div class="field">
            <label for="name">Nombre</label>
            <input id="name" class="input" formControlName="name" placeholder="Angular" />
          </div>
          <button class="btn btn-primary" type="submit" [disabled]="saving()">Añadir</button>
        </form>
      </div>

      <div class="card">
        <h2>Existentes</h2>

        @if (loading()) {
          <p class="muted">Cargando…</p>
        } @else if (tags().length === 0) {
          <p class="empty">No hay etiquetas.</p>
        } @else {
          <div class="row">
            @for (tag of tags(); track tag.id) {
              <span class="badge badge-admin">
                #{{ tag.name }} ({{ tag.posts_count ?? 0 }})
                <button class="btn btn-sm" type="button" style="margin-left: .35rem" (click)="rename(tag)">✎</button>
                <button class="btn btn-sm btn-danger" type="button" (click)="remove(tag)">✕</button>
              </span>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class TagsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  protected readonly tags = signal<Tag[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({ name: ['', Validators.required] });

  ngOnInit(): void {
    this.load();
  }

  protected create(): void {
    if (this.form.invalid) {
      return;
    }

    this.saving.set(true);

    this.api.createTag(this.form.getRawValue()).subscribe({
      next: (tag) => {
        this.tags.update((items) => [...items, tag].sort((a, b) => a.name.localeCompare(b.name)));
        this.form.reset({ name: '' });
        this.saving.set(false);
      },
      error: (error) => {
        this.saving.set(false);
        this.error.set(errorMessage(error));
      },
    });
  }

  protected rename(tag: Tag): void {
    const name = window.prompt('Nuevo nombre', tag.name);

    if (!name || name === tag.name) {
      return;
    }

    this.api.updateTag(tag.id, { name }).subscribe({
      next: (updated) => this.tags.update((items) => items.map((item) => (item.id === updated.id ? updated : item))),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  protected remove(tag: Tag): void {
    if (!window.confirm(`¿Borrar la etiqueta «${tag.name}»?`)) {
      return;
    }

    this.api.deleteTag(tag.id).subscribe({
      next: () => this.tags.update((items) => items.filter((item) => item.id !== tag.id)),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  private load(): void {
    this.api.tags().subscribe({
      next: (tags) => {
        this.tags.set(tags);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });
  }
}
