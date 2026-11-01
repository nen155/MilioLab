import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../core/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-shell">
      <aside class="sidebar">
        <a class="sidebar-brand" routerLink="/">
          <span class="mark">M</span>
          <span>MilioLab</span>
        </a>

        <nav class="sidebar-nav" aria-label="Secciones del panel">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Escritorio</a>
          <a routerLink="/posts" routerLinkActive="active">Entradas</a>
          <a routerLink="/pages" routerLinkActive="active">Páginas</a>
          <a routerLink="/categories" routerLinkActive="active">Categorías</a>
          <a routerLink="/tags" routerLinkActive="active">Etiquetas</a>
          <a routerLink="/media" routerLinkActive="active">Multimedia</a>
          <a routerLink="/menu" routerLinkActive="active">Menú</a>
          <a routerLink="/settings" routerLinkActive="active">Ajustes</a>
          <a routerLink="/account" routerLinkActive="active">Mi cuenta</a>
        </nav>

        <div class="sidebar-footer">
          <p class="sidebar-user">
            {{ name() }}
            <small>{{ role() }}</small>
          </p>
          <a [href]="siteUrl" target="_blank" rel="noopener">Ver la web ↗</a>
          <button type="button" (click)="logout()">Cerrar sesión</button>
        </div>
      </aside>

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  private readonly auth = inject(AuthService);

  protected readonly siteUrl = environment.siteUrl;
  protected readonly name = computed(() => this.auth.user()?.name ?? 'Cuenta');
  protected readonly role = computed(() =>
    this.auth.user()?.is_admin ? 'Administrador' : 'Editor',
  );

  protected logout(): void {
    this.auth.logout();
  }
}
