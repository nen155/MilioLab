import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { Theme } from '../../core/models';

@Component({
  selector: 'app-themes',
  imports: [FormsModule],
  template: `
    <header class="page-head">
      <div>
        <h1>Temas</h1>
        <p>Cambia el diseño completo de la web pública: escenario, raíl, tarjetas y línea de tiempo, además de los colores y la tipografía. El tema activo se aplica al instante.</p>
      </div>
      <div class="row">
        <button class="btn" type="button" (click)="newTheme()">Nuevo tema</button>
        <button class="btn btn-primary" type="button" [disabled]="saving()" (click)="save()">
          {{ saving() ? 'Guardando…' : 'Guardar tema' }}
        </button>
      </div>
    </header>

    @if (error()) { <div class="alert alert-error">{{ error() }}</div> }
    @if (notice()) { <div class="alert alert-ok">{{ notice() }}</div> }

    <div class="grid grid-2">
      <div class="card">
        <h2>Disponibles</h2>

        @if (loading()) {
          <p class="muted">Cargando…</p>
        } @else if (themes().length === 0) {
          <p class="empty">No hay temas.</p>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr><th>Nombre</th><th>Diseño</th><th>Estado</th><th></th></tr>
              </thead>
              <tbody>
                @for (theme of themes(); track theme.id) {
                  <tr>
                    <td>
                      <button class="btn btn-sm" type="button" (click)="edit(theme)">{{ theme.name }}</button>
                      <div class="small muted">{{ theme.slug }}</div>
                    </td>
                    <td class="small muted">{{ layoutLabel(theme.layout) }}</td>
                    <td>
                      @if (theme.is_active) {
                        <span class="badge badge-published">Activo</span>
                      } @else {
                        <span class="badge badge-draft">Inactivo</span>
                      }
                    </td>
                    <td class="actions">
                      @if (!theme.is_active) {
                        <button class="btn btn-sm" type="button" (click)="activate(theme)">Activar</button>
                        <button class="btn btn-sm btn-danger" type="button" (click)="remove(theme)">Borrar</button>
                      }
                      <button class="btn btn-sm" type="button" (click)="copy(theme)">Copiar JSON</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <div class="card">
        <h2>{{ editingId() ? 'Editar tema' : 'Nuevo tema' }}</h2>

        <div class="field">
          <label for="theme-name">Nombre</label>
          <input id="theme-name" class="input" [(ngModel)]="name" placeholder="Papel viejo" />
        </div>

        <div class="field">
          <label for="theme-layout">Diseño</label>
          <select id="theme-layout" class="input" [(ngModel)]="layout">
            <option value="notebook">Cuaderno · papel milimetrado</option>
            <option value="sketch">Roca · presas y cuerda</option>
            <option value="cards">Cartas · marco dorado</option>
            <option value="hud">Consola · interfaz táctica</option>
          </select>
          <p class="small muted">El diseño cambia la estructura de la web (raíl, nodos y línea de tiempo), no solo los colores.</p>
        </div>

        <div class="form-row">
          @for (token of allowed(); track token) {
            <div class="field">
              <label [for]="'t-' + token">{{ token }}</label>
              <div class="row">
                @if (isColor(token)) {
                  <input
                    type="color"
                    [id]="'c-' + token"
                    [ngModel]="colorValue(token)"
                    (ngModelChange)="setToken(token, $event)"
                    style="width: 44px; height: 34px; padding: 2px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface)"
                  />
                }
                <input
                  class="input"
                  [id]="'t-' + token"
                  [ngModel]="tokens()[token] || ''"
                  (ngModelChange)="setToken(token, $event)"
                  [placeholder]="token === '--grid-size' ? '24px' : '#ffffff'"
                />
              </div>
            </div>
          }
        </div>

        <p class="small muted">
          Solo se aceptan las variables listadas. Los valores con llaves o punto y coma se descartan.
        </p>
      </div>
    </div>

    <div class="card">
      <h2>Importar tema (JSON)</h2>
      <p class="muted small">
        Pega un tema creado en otro sitio con el formato
        <code>{{ '{ "name": "…", "tokens": { "--paper": "#…" } }' }}</code>.
      </p>
      <textarea class="textarea" rows="6" [(ngModel)]="importJson" placeholder='{ "name": "Papel viejo", "tokens": { "--paper": "#f4efe3", "--ink": "#1b1a17", "--accent": "#8b5e34" } }'></textarea>
      <div class="row" style="margin-top: .6rem">
        <label class="checkbox"><input type="checkbox" [(ngModel)]="importActivate" /> Activar al importar</label>
        <button class="btn" type="button" [disabled]="importing()" (click)="importTheme()">
          {{ importing() ? 'Importando…' : 'Importar' }}
        </button>
      </div>
    </div>
  `,
})
export class ThemesComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly themes = signal<Theme[]>([]);
  protected readonly allowed = signal<string[]>([]);
  protected readonly tokens = signal<Record<string, string>>({});
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly importing = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);
  protected readonly editingId = signal<number | null>(null);

  protected name = '';
  protected layout: 'notebook' | 'cards' | 'sketch' | 'hud' = 'notebook';
  protected importJson = '';
  protected importActivate = true;

  ngOnInit(): void {
    this.load();
  }

  protected edit(theme: Theme): void {
    this.editingId.set(theme.id);
    this.name = theme.name;
    this.layout = theme.layout ?? 'notebook';
    this.tokens.set({ ...theme.tokens });
  }

  protected newTheme(): void {
    this.editingId.set(null);
    this.name = '';
    this.layout = 'notebook';
    this.tokens.set({ ...(this.themes().find((t) => t.is_active)?.tokens ?? {}) });
  }

  protected setToken(token: string, value: string): void {
    this.tokens.update((tokens) => ({ ...tokens, [token]: value }));
  }

  protected isColor(token: string): boolean {
    return /^--(paper|ink|line|accent|grid)/.test(token);
  }

  protected layoutLabel(layout: Theme['layout'] | undefined): string {
    return {
      notebook: 'Cuaderno',
      sketch: 'Roca',
      cards: 'Cartas',
      hud: 'Consola',
    }[layout ?? 'notebook'];
  }

  protected colorValue(token: string): string {
    const value = this.tokens()[token] ?? '';

    return /^#[0-9a-f]{3,8}$/i.test(value) ? value : '#ffffff';
  }

  protected save(): void {
    if (!this.name.trim()) {
      this.error.set('Ponle un nombre al tema.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const id = this.editingId();
    const request = id
      ? this.api.updateTheme(id, { name: this.name.trim(), tokens: this.tokens(), layout: this.layout })
      : this.api.createTheme({ name: this.name.trim(), tokens: this.tokens(), layout: this.layout });

    request.subscribe({
      next: (theme) => {
        this.saving.set(false);
        this.editingId.set(theme.id);
        this.flash(id ? 'Tema actualizado.' : 'Tema creado. Actívalo para verlo en la web.');
        this.load();
      },
      error: (error) => {
        this.saving.set(false);
        this.error.set(errorMessage(error));
      },
    });
  }

  protected activate(theme: Theme): void {
    this.api.activateTheme(theme.id).subscribe({
      next: () => {
        this.flash(`«${theme.name}» activo. Recarga la web para verlo.`);
        this.load();
      },
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  protected remove(theme: Theme): void {
    if (!window.confirm(`¿Borrar el tema «${theme.name}»?`)) {
      return;
    }

    this.api.deleteTheme(theme.id).subscribe({
      next: () => this.load(),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  protected copy(theme: Theme): void {
    const json = JSON.stringify({ name: theme.name, tokens: theme.tokens }, null, 2);
    navigator.clipboard?.writeText(json).then(
      () => this.flash('JSON copiado.'),
      () => this.error.set('No se pudo copiar.'),
    );
  }

  protected importTheme(): void {
    this.error.set(null);

    let parsed: { name?: string; tokens?: Record<string, string> };

    try {
      parsed = JSON.parse(this.importJson);
    } catch {
      this.error.set('El JSON no es válido.');
      return;
    }

    if (!parsed.name || !parsed.tokens) {
      this.error.set('El JSON necesita «name» y «tokens».');
      return;
    }

    this.importing.set(true);

    this.api.importTheme({ name: parsed.name, tokens: parsed.tokens, activate: this.importActivate }).subscribe({
      next: (theme) => {
        this.importing.set(false);
        this.importJson = '';
        this.flash(`«${theme.name}» importado.`);
        this.load();
      },
      error: (error) => {
        this.importing.set(false);
        this.error.set(errorMessage(error));
      },
    });
  }

  private load(): void {
    this.loading.set(true);

    this.api.themes().subscribe({
      next: (response) => {
        this.themes.set(response.data);
        this.allowed.set(response.allowed);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });
  }

  private flash(message: string): void {
    this.notice.set(message);
    setTimeout(() => this.notice.set(null), 3000);
  }
}
