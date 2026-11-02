import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { MenuItem, Page } from '../../core/models';

@Component({
  selector: 'app-menu',
  imports: [ReactiveFormsModule],
  template: `
    <header class="page-head">
      <div>
        <h1>Menú</h1>
        <p>Enlaces de la cabecera y del pie de la web.</p>
      </div>
    </header>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }

    <div class="grid grid-2">
      <div class="card">
        <h2>Añadir enlace</h2>
        <form [formGroup]="form" (ngSubmit)="create()">
          <div class="field">
            <label for="label">Texto</label>
            <input id="label" class="input" formControlName="label" placeholder="Blog" />
          </div>

          <div class="field">
            <label for="label_en">Texto en inglés</label>
            <input id="label_en" class="input" formControlName="label_en" placeholder="Blog" />
          </div>

          <div class="field">
            <label for="page_id">Página del sitio (opcional)</label>
            <select id="page_id" class="select" formControlName="page_id">
              <option [ngValue]="null">— Ninguna (usar URL) —</option>
              @for (page of pages(); track page.id) {
                <option [ngValue]="page.id">{{ page.title }}</option>
              }
            </select>
          </div>

          <div class="field">
            <label for="url">URL manual (opcional)</label>
            <input id="url" class="input" formControlName="url" placeholder="/blog o https://…" />
          </div>

          <div class="field">
            <label for="target">Abrir en</label>
            <select id="target" class="select" formControlName="target">
              <option value="_self">Misma pestaña</option>
              <option value="_blank">Pestaña nueva</option>
            </select>
          </div>

          <button class="btn btn-primary" type="submit" [disabled]="saving()">Añadir al menú</button>
        </form>
      </div>

      <div class="card">
        <h2>Enlaces actuales</h2>

        @if (loading()) {
          <p class="muted">Cargando…</p>
        } @else if (items().length === 0) {
          <p class="empty">El menú está vacío.</p>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Texto</th>
                  <th>Destino</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (item of items(); track item.id; let index = $index) {
                  <tr>
                    <td>
                      {{ item.label }}
                      @if (item.label_en) {
                        <span class="muted small">· {{ item.label_en }}</span>
                      }
                    </td>
                    <td class="muted small">{{ item.url }}</td>
                    <td class="actions">
                      <button class="btn btn-sm" type="button" [disabled]="index === 0" (click)="move(index, -1)">↑</button>
                      <button class="btn btn-sm" type="button" [disabled]="index === items().length - 1" (click)="move(index, 1)">↓</button>
                      <button class="btn btn-sm btn-danger" type="button" (click)="remove(item)">Borrar</button>
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
export class MenuComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  protected readonly items = signal<MenuItem[]>([]);
  protected readonly pages = signal<Page[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    label: ['', Validators.required],
    label_en: [''],
    page_id: [null as number | null],
    url: [''],
    target: ['_self' as '_self' | '_blank'],
  });

  ngOnInit(): void {
    this.load();
    this.api.pages({ per_page: 100 }).subscribe((response) => this.pages.set(response.data));
  }

  protected create(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();

    if (!value.page_id && !value.url) {
      this.error.set('Indica una página o una URL.');
      return;
    }

    this.saving.set(true);

    this.api
      .createMenuItem({
        label: value.label,
        label_en: value.label_en || null,
        page_id: value.page_id,
        url: value.url || undefined,
        target: value.target,
        position: this.items().length,
      })
      .subscribe({
        next: (item) => {
          this.items.update((items) => [...items, item]);
          this.form.reset({ label: '', label_en: '', page_id: null, url: '', target: '_self' });
          this.saving.set(false);
        },
        error: (error) => {
          this.saving.set(false);
          this.error.set(errorMessage(error));
        },
      });
  }

  protected move(index: number, delta: number): void {
    const items = [...this.items()];
    const target = index + delta;

    if (target < 0 || target >= items.length) {
      return;
    }

    [items[index], items[target]] = [items[target], items[index]];
    this.items.set(items);
    this.persistOrder();
  }

  protected remove(item: MenuItem): void {
    if (!window.confirm(`¿Quitar «${item.label}» del menú?`)) {
      return;
    }

    this.api.deleteMenuItem(item.id).subscribe({
      next: () => this.items.update((items) => items.filter((current) => current.id !== item.id)),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  private persistOrder(): void {
    const payload = this.items().map((item, index) => ({
      id: item.id,
      position: index,
      parent_id: null,
    }));

    this.api.reorderMenu(payload).subscribe({
      next: (items) => this.items.set(items),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  private load(): void {
    this.api.menuItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });
  }
}
