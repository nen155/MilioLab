import { Component, OnInit, computed, inject, input, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { Media, PagePayload } from '../../core/models';
import { RichEditorComponent } from '../editor/rich-editor.component';
import { MediaPickerComponent } from '../media/media-picker.component';

@Component({
  selector: 'app-page-edit',
  imports: [ReactiveFormsModule, RouterLink, RichEditorComponent, MediaPickerComponent],
  template: `
    <header class="page-head">
      <div>
        <h1>{{ isNew() ? 'Nueva página' : 'Editar página' }}</h1>
        <p>Contenido fijo del sitio.</p>
      </div>
      <div class="row">
        <a class="btn" routerLink="/pages">Volver</a>
        @if (!isNew()) {
          <a class="btn" [href]="publicUrl()" target="_blank" rel="noopener">Ver</a>
        }
        <button class="btn" type="button" [disabled]="saving()" (click)="save('draft')">Guardar borrador</button>
        <button class="btn btn-primary" type="button" [disabled]="saving()" (click)="save('published')">
          {{ saving() ? 'Guardando…' : 'Publicar' }}
        </button>
      </div>
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
      <form [formGroup]="form" class="editor-layout">
        <div class="card">
          <div class="field">
            <label for="title">Título</label>
            <input id="title" class="input" formControlName="title" />
          </div>

          <div class="field">
            <label for="slug">URL</label>
            <input id="slug" class="input" formControlName="slug" placeholder="se-genera-desde-el-titulo" />
            <span class="hint">Aparecerá en miliolab.com/<strong>url</strong>.</span>
          </div>

          <div class="field">
            <label for="excerpt">Entradilla</label>
            <textarea id="excerpt" class="textarea" formControlName="excerpt" rows="2"></textarea>
          </div>

          <div class="field">
            <label>Contenido</label>
            <app-rich-editor formControlName="body" (imageRequest)="pickerOpen.set(true)" />
          </div>
        </div>

        <aside>
          <div class="card">
            <h2>Publicación</h2>

            <div class="field">
              <label for="status">Estado</label>
              <select id="status" class="select" formControlName="status">
                <option value="draft">Borrador</option>
                <option value="published">Publicada</option>
              </select>
            </div>

            <div class="field">
              <label for="template">Plantilla</label>
              <select id="template" class="select" formControlName="template">
                <option value="default">Estándar</option>
                <option value="wide">Ancha</option>
                <option value="landing">Portada</option>
              </select>
            </div>

            <div class="field">
              <label for="published_at">Fecha de publicación</label>
              <input id="published_at" class="input" type="datetime-local" formControlName="published_at" />
            </div>

            @if (!isNew()) {
              <button class="btn btn-danger" type="button" (click)="remove()">Borrar página</button>
            }
          </div>

          <div class="card">
            <h2>SEO</h2>

            <div class="field">
              <label for="meta_title">Título para buscadores</label>
              <input id="meta_title" class="input" formControlName="meta_title" />
            </div>

            <div class="field">
              <label for="meta_description">Descripción</label>
              <textarea id="meta_description" class="textarea" formControlName="meta_description" rows="3"></textarea>
            </div>
          </div>
        </aside>
      </form>
    }

    @if (pickerOpen()) {
      <app-media-picker (selected)="onMediaSelected($event)" (closed)="pickerOpen.set(false)" />
    }
  `,
})
export class PageEditComponent implements OnInit {
  readonly id = input<string>();

  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);
  protected readonly pickerOpen = signal(false);
  protected readonly slug = signal('');
  private readonly editor = viewChild(RichEditorComponent);

  protected readonly isNew = computed(() => !this.id());

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(190)]],
    slug: [''],
    excerpt: [''],
    body: [''],
    template: ['default' as 'default' | 'wide' | 'landing'],
    status: ['draft' as 'draft' | 'published'],
    published_at: [''],
    meta_title: [''],
    meta_description: [''],
  });

  ngOnInit(): void {
    const id = this.id();

    if (!id) {
      this.loading.set(false);
      return;
    }

    this.api.page(Number(id)).subscribe({
      next: (page) => {
        this.form.patchValue({
          title: page.title,
          slug: page.slug,
          excerpt: page.excerpt ?? '',
          body: page.body ?? '',
          template: page.template,
          status: page.status,
          published_at: this.toLocalInput(page.published_at),
          meta_title: page.meta_title ?? '',
          meta_description: page.meta_description ?? '',
        });
        this.slug.set(page.slug);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected onMediaSelected(media: Media): void {
    this.pickerOpen.set(false);
    this.editor()?.insertImage(media.url, media.alt ?? '');
  }

  protected save(status: 'draft' | 'published'): void {
    if (this.form.controls.title.invalid) {
      this.form.controls.title.markAsTouched();
      this.error.set('El título es obligatorio.');
      return;
    }

    const value = this.form.getRawValue();
    const publishedAt =
      status === 'published' && !value.published_at
        ? new Date().toISOString()
        : value.published_at
          ? new Date(value.published_at).toISOString()
          : null;

    const payload: PagePayload = {
      title: value.title,
      slug: value.slug || '',
      excerpt: value.excerpt || null,
      body: value.body || null,
      template: value.template,
      status,
      published_at: publishedAt,
      meta_title: value.meta_title || null,
      meta_description: value.meta_description || null,
    };

    this.saving.set(true);
    this.error.set(null);

    const id = this.id();
    const request = id ? this.api.updatePage(Number(id), payload) : this.api.createPage(payload);

    request.subscribe({
      next: (page) => {
        this.saving.set(false);
        this.slug.set(page.slug);
        this.flash(status === 'published' ? 'Página publicada.' : 'Borrador guardado.');

        if (!id) {
          this.router.navigate(['/pages', page.id]);
        }
      },
      error: (error) => {
        this.saving.set(false);
        this.error.set(errorMessage(error));
      },
    });
  }

  protected remove(): void {
    const id = this.id();

    if (!id || !window.confirm('¿Borrar esta página? No se puede deshacer.')) {
      return;
    }

    this.api.deletePage(Number(id)).subscribe({
      next: () => this.router.navigate(['/pages']),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  protected publicUrl(): string {
    return `/${this.slug()}`;
  }

  private flash(message: string): void {
    this.notice.set(message);
    setTimeout(() => this.notice.set(null), 2500);
  }

  private toLocalInput(value?: string | null): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    const pad = (part: number) => String(part).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
