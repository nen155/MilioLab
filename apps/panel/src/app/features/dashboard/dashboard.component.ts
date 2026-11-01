import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { Stats } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <header class="page-head">
      <div>
        <h1>Escritorio</h1>
        <p>Resumen del contenido y accesos rápidos.</p>
      </div>
      <div class="row">
        <a class="btn" routerLink="/media">Multimedia</a>
        <a class="btn btn-primary" routerLink="/posts/new">Nueva entrada</a>
      </div>
    </header>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }

    @if (stats(); as data) {
      <div class="grid grid-3">
        <div class="card stat">
          <span class="stat-value">{{ data.posts.total }}</span>
          <span class="stat-label">Entradas</span>
          <span class="small muted">{{ data.posts.published }} publicadas · {{ data.posts.drafts }} borradores</span>
        </div>
        <div class="card stat">
          <span class="stat-value">{{ data.pages.total }}</span>
          <span class="stat-label">Páginas</span>
          <span class="small muted">{{ data.pages.published }} publicadas</span>
        </div>
        <div class="card stat">
          <span class="stat-value">{{ data.media }}</span>
          <span class="stat-label">Archivos</span>
          <span class="small muted">en la biblioteca</span>
        </div>
      </div>

      <div class="card">
        <div class="row" style="justify-content: space-between; margin-bottom: 0.6rem">
          <h2 style="margin: 0">Últimas entradas editadas</h2>
          <a class="small" routerLink="/posts">Ver todas</a>
        </div>

        @if (data.recent_posts.length === 0) {
          <p class="empty">Todavía no hay entradas. <a routerLink="/posts/new">Crea la primera</a>.</p>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (post of data.recent_posts; track post.id) {
                  <tr>
                    <td><a [routerLink]="['/posts', post.id]">{{ post.title }}</a></td>
                    <td class="muted">{{ post.category || '—' }}</td>
                    <td>
                      <span class="badge" [class.badge-published]="post.status === 'published'" [class.badge-draft]="post.status === 'draft'">
                        {{ post.status === 'published' ? 'Publicada' : 'Borrador' }}
                      </span>
                    </td>
                    <td class="actions">
                      <a class="btn btn-sm" [routerLink]="['/posts', post.id]">Editar</a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <div class="grid grid-2">
        <div class="card">
          <h2>Contenido</h2>
          <p class="muted small">Entradas para el blog y páginas fijas (inicio, sobre mí, contacto…).</p>
          <div class="row">
            <a class="btn" routerLink="/pages">Páginas</a>
            <a class="btn" routerLink="/categories">Categorías</a>
            <a class="btn" routerLink="/tags">Etiquetas</a>
          </div>
        </div>
        <div class="card">
          <h2>Sitio</h2>
          <p class="muted small">Nombre, textos del pie, redes sociales y color de acento.</p>
          <div class="row">
            <a class="btn" routerLink="/settings">Ajustes</a>
            <a class="btn" routerLink="/menu">Menú</a>
          </div>
        </div>
      </div>
    } @else if (!error()) {
      <div class="card"><p class="muted">Cargando…</p></div>
    }
  `,
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly stats = signal<Stats | null>(null);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.api.stats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }
}
