import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { PaginationMeta, Post } from '../../core/models';

@Component({
  selector: 'app-post-list',
  imports: [RouterLink, FormsModule],
  template: `
    <header class="page-head">
      <div>
        <h1>Entradas</h1>
        <p>Los artículos del blog.</p>
      </div>
      <a class="btn btn-primary" routerLink="/posts/new">Nueva entrada</a>
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
          placeholder="Buscar por título…"
          [(ngModel)]="query"
          (keyup.enter)="load(1)"
        />
        <select class="select" style="max-width: 180px" [(ngModel)]="status" (change)="load(1)">
          <option value="">Todos los estados</option>
          <option value="published">Publicadas</option>
          <option value="draft">Borradores</option>
        </select>
        <button class="btn" type="button" (click)="load(1)">Filtrar</button>
      </div>

      @if (loading()) {
        <p class="muted">Cargando…</p>
      } @else if (posts().length === 0) {
        <p class="empty">No hay entradas con esos filtros.</p>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (post of posts(); track post.id) {
                <tr>
                  <td>
                    <a [routerLink]="['/posts', post.id]">{{ post.title }}</a>
                    <div class="small muted">/blog/{{ post.slug }}</div>
                  </td>
                  <td class="muted">{{ post.category?.name || '—' }}</td>
                  <td>
                    <span
                      class="badge"
                      [class.badge-published]="post.status === 'published'"
                      [class.badge-draft]="post.status === 'draft'"
                    >
                      {{ post.status === 'published' ? 'Publicada' : 'Borrador' }}
                    </span>
                  </td>
                  <td class="muted small">{{ date(post.published_at || post.created_at) }}</td>
                  <td class="actions">
                    <a class="btn btn-sm" [routerLink]="['/posts', post.id]">Editar</a>
                    <button class="btn btn-sm btn-danger" type="button" (click)="remove(post)">Borrar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (meta(); as pagination) {
          @if (pagination.last_page > 1) {
            <div class="row" style="justify-content: space-between; margin-top: 1rem">
              <button class="btn btn-sm" type="button" [disabled]="pagination.current_page <= 1" (click)="load(pagination.current_page - 1)">
                ← Anterior
              </button>
              <span class="small muted">Página {{ pagination.current_page }} de {{ pagination.last_page }}</span>
              <button class="btn btn-sm" type="button" [disabled]="pagination.current_page >= pagination.last_page" (click)="load(pagination.current_page + 1)">
                Siguiente →
              </button>
            </div>
          }
        }
      }
    </div>
  `,
})
export class PostListComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly posts = signal<Post[]>([]);
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

    this.api
      .posts({ page, q: this.query || undefined, status: this.status || undefined })
      .subscribe({
        next: (response) => {
          this.posts.set(response.data);
          this.meta.set(response.meta);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(errorMessage(error));
          this.loading.set(false);
        },
      });
  }

  protected remove(post: Post): void {
    if (!window.confirm(`¿Borrar «${post.title}»? No se puede deshacer.`)) {
      return;
    }

    this.api.deletePost(post.id).subscribe({
      next: () => this.posts.update((items) => items.filter((item) => item.id !== post.id)),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  protected date(value?: string | null): string {
    return value ? new Date(value).toLocaleDateString('es-ES') : '—';
  }
}
