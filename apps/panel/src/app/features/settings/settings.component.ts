import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { Page, SettingItem } from '../../core/models';

interface Field {
  key: string;
  label: string;
  type: SettingItem['type'] | 'color';
  help?: string;
  options?: 'pages';
}

interface Group {
  id: string;
  title: string;
  description: string;
  fields: Field[];
}

const GROUPS: Group[] = [
  {
    id: 'general',
    title: 'Identidad del sitio',
    description: 'Nombre, descripción y textos que aparecen en la cabecera y el pie.',
    fields: [
      { key: 'site_name', label: 'Nombre del sitio', type: 'string' },
      { key: 'site_tagline', label: 'Lema', type: 'string', help: 'Aparece bajo el nombre en la portada.' },
      { key: 'site_description', label: 'Descripción', type: 'text', help: 'Se usa como meta description por defecto.' },
      { key: 'site_url', label: 'URL pública', type: 'string', help: 'https://miliolab.com' },
      { key: 'home_page_id', label: 'Página de inicio', type: 'int', options: 'pages' },
      { key: 'footer_text', label: 'Texto del pie', type: 'string' },
    ],
  },
  {
    id: 'blog',
    title: 'Blog',
    description: 'Cómo se presenta el listado de entradas.',
    fields: [
      { key: 'blog_title', label: 'Título del blog', type: 'string' },
      { key: 'blog_intro', label: 'Introducción', type: 'text' },
      { key: 'posts_per_page', label: 'Entradas por página', type: 'int' },
      { key: 'show_author', label: 'Mostrar el autor en las entradas', type: 'bool' },
    ],
  },
  {
    id: 'apariencia',
    title: 'Apariencia',
    description: 'Detalles visuales del sitio público.',
    fields: [{ key: 'accent_color', label: 'Color de acento', type: 'color' }],
  },
  {
    id: 'contacto',
    title: 'Contacto',
    description: 'Datos que se muestran en la web.',
    fields: [{ key: 'contact_email', label: 'Correo de contacto', type: 'string' }],
  },
  {
    id: 'social',
    title: 'Redes sociales',
    description: 'Enlaces del pie. Deja vacío lo que no uses.',
    fields: [
      { key: 'social_github', label: 'GitHub', type: 'string' },
      { key: 'social_linkedin', label: 'LinkedIn', type: 'string' },
      { key: 'social_x', label: 'X / Twitter', type: 'string' },
      { key: 'social_youtube', label: 'YouTube', type: 'string' },
    ],
  },
];

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  template: `
    <header class="page-head">
      <div>
        <h1>Ajustes</h1>
        <p>Configuración del sitio. Los cambios se ven al recargar la web.</p>
      </div>
      <button class="btn btn-primary" type="button" [disabled]="saving()" (click)="save()">
        {{ saving() ? 'Guardando…' : 'Guardar cambios' }}
      </button>
    </header>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }
    @if (notice()) {
      <div class="alert alert-ok">{{ notice() }}</div>
    }

    @if (loading()) {
      <div class="card"><p class="muted">Cargando…</p></div>
    } @else {
      @for (group of groups; track group.id) {
        <div class="card">
          <h2>{{ group.title }}</h2>
          <p class="muted small">{{ group.description }}</p>

          <div class="form-row">
            @for (field of group.fields; track field.key) {
              <div class="field">
                <label [for]="field.key">{{ field.label }}</label>

                @switch (field.type) {
                  @case ('bool') {
                    <label class="checkbox">
                      <input
                        type="checkbox"
                        [id]="field.key"
                        [ngModel]="boolValue(field.key)"
                        (ngModelChange)="setValue(field.key, $event)"
                      />
                      Activado
                    </label>
                  }
                  @case ('text') {
                    <textarea
                      class="textarea"
                      [id]="field.key"
                      rows="2"
                      [ngModel]="textValue(field.key)"
                      (ngModelChange)="setValue(field.key, $event)"
                    ></textarea>
                  }
                  @case ('color') {
                    <div class="row">
                      <input
                        type="color"
                        [id]="field.key"
                        [ngModel]="textValue(field.key) || '#6366f1'"
                        (ngModelChange)="setValue(field.key, $event)"
                        style="width: 54px; height: 38px; padding: 2px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface)"
                      />
                      <input
                        class="input"
                        [ngModel]="textValue(field.key)"
                        (ngModelChange)="setValue(field.key, $event)"
                        placeholder="#6366f1"
                      />
                    </div>
                  }
                  @default {
                    @if (field.options === 'pages') {
                      <select
                        class="select"
                        [id]="field.key"
                        [ngModel]="numberValue(field.key)"
                        (ngModelChange)="setValue(field.key, $event)"
                      >
                        <option [ngValue]="0">— Sin portada —</option>
                        @for (page of pages(); track page.id) {
                          <option [ngValue]="page.id">{{ page.title }}</option>
                        }
                      </select>
                    } @else {
                      <input
                        class="input"
                        [id]="field.key"
                        [type]="field.type === 'int' ? 'number' : 'text'"
                        [ngModel]="textValue(field.key)"
                        (ngModelChange)="setValue(field.key, $event)"
                      />
                    }
                  }
                }

                @if (field.help) {
                  <span class="hint">{{ field.help }}</span>
                }
              </div>
            }
          </div>
        </div>
      }
    }
  `,
})
export class SettingsComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly groups = GROUPS;
  protected readonly values = signal<Record<string, unknown>>({});
  protected readonly pages = signal<Page[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);

  ngOnInit(): void {
    this.api.settings().subscribe({
      next: (response) => {
        this.values.set({ ...response.settings });
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });

    this.api.pages({ per_page: 100 }).subscribe((response) => this.pages.set(response.data));
  }

  protected textValue(key: string): string {
    const value = this.values()[key];

    return value === null || value === undefined ? '' : String(value);
  }

  protected numberValue(key: string): number {
    return Number(this.values()[key] ?? 0);
  }

  protected boolValue(key: string): boolean {
    const value = this.values()[key];

    return value === true || value === '1' || value === 1;
  }

  protected setValue(key: string, value: unknown): void {
    this.values.update((values) => ({ ...values, [key]: value }));
  }

  protected save(): void {
    const items = this.groups.flatMap((group) =>
      group.fields.map((field) => ({
        key: field.key,
        value: this.settingValue(field.key),
        type: field.type === 'color' ? ('string' as const) : (field.type as SettingItem['type']),
        group: group.id,
      })),
    );

    this.saving.set(true);
    this.error.set(null);

    this.api.saveSettings(items).subscribe({
      next: () => {
        this.saving.set(false);
        this.flash('Ajustes guardados.');
      },
      error: (error) => {
        this.saving.set(false);
        this.error.set(errorMessage(error));
      },
    });
  }

  private settingValue(key: string): string | number | boolean | null {
    const value = this.values()[key];

    if (value === undefined || value === null) {
      return null;
    }

    return typeof value === 'boolean' || typeof value === 'number' ? value : String(value);
  }

  private flash(message: string): void {
    this.notice.set(message);
    setTimeout(() => this.notice.set(null), 2500);
  }
}
