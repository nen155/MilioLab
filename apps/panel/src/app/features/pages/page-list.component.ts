import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { Page, PaginationMeta } from '../../core/models';

@Component({
  selector: 'app-page-list',
  imports: [RouterLink, FormsModule],
  template: `
    <header class="page-head">
      <div>
        <h1>Páginas</h1>
        <p>Contenido fijo: inicio, sobre mí, contacto…</p>
      </div>
      <a class="btn btn-primary" routerLink="/pages/new">Nueva página</a>
    </header>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }

    <div class="card">
      <div class="row" style="margin-bottom: 1rem">
        <input
          class="input"
          style="max-width: 280px"
          type="search"
          placeholder="Buscar…"
          [(ngModel)]="query"
          (keyup.enter)="load(1)"
        />
        <select class="select" style="max-width: 180px" [(ngModel)]="status" (change)="load(1)">
          <option value="">Todas</option>
          <option value="published">Publicadas</option>
          <option value="draft">Borradores</option>
        </select>
        <button class="btn" type="button" (click)="load(1)">Filtrar</button>
      </div>

      @if (loading()) {
        <p class="muted">Cargando…</p>
      } @else if (pages().length === 0) {
        <p class="empty">No hay páginas.</p>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Plantilla</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (page of pages(); track page.id) {
                <tr>
                  <td>
                    <a [routerLink]="['/pages', page.id]">{{ page.title }}</a>
                    <div class="small muted">/{{ page.slug }}</div>
                  </td>
                  <td class="muted">{{ page.template }}</td>
                  <td>
                    <span class="badge" [class.badge-published]="page.status === 'published'" [class.badge-draft]="page.status === 'draft'">
                      {{ page.status === 'published' ? 'Publicada' : 'Borrador' }}
                    </span>
                  </td>
                  <td class="actions">
                    <a class="btn btn-sm" [routerLink]="['/pages', page.id]">Editar</a>
                    <button class="btn btn-sm btn-danger" type="button" (click)="remove(page)">Borrar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class PageListComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly pages = signal<Page[]>([]);
  protected readonly meta = signal<PaginationMeta | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected query = '';
  protected status = '';

  ngOnInit(): void {
    this.load(1);
  }

  protected load(page: number): void {
    this.loading.set(true);

    this.api.pages({ page, q: this.query || undefined, status: this.status || undefined }).subscribe({
      next: (response) => {
        this.pages.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected remove(page: Page): void {
    if (!window.confirm(`¿Borrar la página «${page.title}»? No se puede deshacer.`)) {
      return;
    }

    this.api.deletePage(page.id).subscribe({
      next: () => this.pages.update((items) => items.filter((item) => item.id !== page.id)),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }
}
