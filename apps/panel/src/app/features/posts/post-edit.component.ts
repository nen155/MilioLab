import { Component, OnInit, computed, inject, input, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { Category, Media, PostPayload, Tag } from '../../core/models';
import { RichEditorComponent } from '../editor/rich-editor.component';
import { MediaPickerComponent } from '../media/media-picker.component';

@Component({
  selector: 'app-post-edit',
  imports: [ReactiveFormsModule, RouterLink, RichEditorComponent, MediaPickerComponent],
  template: `
    <header class="page-head">
      <div>
        <h1>{{ isNew() ? 'Nueva entrada' : 'Editar entrada' }}</h1>
        <p>{{ isNew() ? 'Escribe un artículo para el blog.' : 'Cambia el contenido y guarda.' }}</p>
      </div>
      <div class="row">
        <a class="btn" routerLink="/posts">Volver</a>
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
            <input id="title" class="input" formControlName="title" placeholder="Título de la entrada" />
          </div>

          <div class="field">
            <label for="slug">URL</label>
            <input id="slug" class="input" formControlName="slug" placeholder="se-genera-desde-el-titulo" />
            <span class="hint">Se puede dejar vacío: se genera a partir del título.</span>
          </div>

          <div class="field">
            <label for="excerpt">Entradilla</label>
            <textarea id="excerpt" class="textarea" formControlName="excerpt" rows="2" placeholder="Resumen corto para las tarjetas del blog"></textarea>
          </div>

          <div class="field">
            <label>Contenido</label>
            <app-rich-editor formControlName="body" (imageRequest)="openPicker('body')" />
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
              <label for="published_at">Fecha de publicación</label>
              <input id="published_at" class="input" type="datetime-local" formControlName="published_at" />
              <span class="hint">Si publicas sin fecha, se usa ahora.</span>
            </div>

            @if (!isNew()) {
              <button class="btn btn-danger" type="button" (click)="remove()">Borrar entrada</button>
            }
          </div>

          <div class="card">
            <h2>Imagen de portada</h2>

            @if (cover(); as image) {
              <img [src]="image.url" [alt]="image.alt || ''" style="width: 100%; border-radius: 8px; margin-bottom: 0.6rem" />
              <div class="row">
                <button class="btn btn-sm" type="button" (click)="openPicker('cover')">Cambiar</button>
                <button class="btn btn-sm btn-danger" type="button" (click)="clearCover()">Quitar</button>
              </div>
            } @else {
              <button class="btn" type="button" (click)="openPicker('cover')">Elegir imagen</button>
            }
          </div>

          <div class="card">
            <h2>Organización</h2>

            <div class="field">
              <label for="category">Categoría</label>
              <select id="category" class="select" formControlName="category_id">
                <option [ngValue]="null">Sin categoría</option>
                @for (category of categories(); track category.id) {
                  <option [ngValue]="category.id">{{ category.name }}</option>
                }
              </select>
            </div>

            <div class="field">
              <label>Etiquetas</label>
              <div class="row">
                @for (tag of tags(); track tag.id) {
                  <button
                    class="btn btn-sm"
                    type="button"
                    [class.btn-primary]="selectedTags().includes(tag.id)"
                    (click)="toggleTag(tag.id)"
                  >
                    {{ tag.name }}
                  </button>
                } @empty {
                  <span class="muted small">No hay etiquetas. <a routerLink="/tags">Crea alguna</a>.</span>
                }
              </div>
            </div>
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
export class PostEditComponent implements OnInit {
  readonly id = input<string>();

  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly categories = signal<Category[]>([]);
  protected readonly tags = signal<Tag[]>([]);
  protected readonly selectedTags = signal<number[]>([]);
  protected readonly cover = signal<Media | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);
  protected readonly pickerOpen = signal(false);
  protected readonly pickerTarget = signal<'cover' | 'body'>('body');
  protected readonly slug = signal('');
  private readonly editor = viewChild(RichEditorComponent);

  protected readonly isNew = computed(() => !this.id());

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(190)]],
    slug: [''],
    excerpt: [''],
    body: [''],
    status: ['draft' as 'draft' | 'published'],
    published_at: [''],
    category_id: [null as number | null],
    meta_title: [''],
    meta_description: [''],
  });

  ngOnInit(): void {
    this.api.categories().subscribe((categories) => this.categories.set(categories));
    this.api.tags().subscribe((tags) => this.tags.set(tags));

    const id = this.id();

    if (!id) {
      this.loading.set(false);
      return;
    }

    this.api.post(Number(id)).subscribe({
      next: (post) => {
        this.form.patchValue({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? '',
          body: post.body ?? '',
          status: post.status,
          published_at: this.toLocalInput(post.published_at),
          category_id: post.category?.id ?? null,
          meta_title: post.meta_title ?? '',
          meta_description: post.meta_description ?? '',
        });
        this.slug.set(post.slug);
        this.selectedTags.set(post.tags?.map((tag) => tag.id) ?? []);
        this.cover.set(post.cover ?? null);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected toggleTag(id: number): void {
    this.selectedTags.update((tags) =>
      tags.includes(id) ? tags.filter((tag) => tag !== id) : [...tags, id],
    );
  }

  protected openPicker(target: 'cover' | 'body'): void {
    this.pickerTarget.set(target);
    this.pickerOpen.set(true);
  }

  protected onMediaSelected(media: Media): void {
    this.pickerOpen.set(false);

    if (this.pickerTarget() === 'cover') {
      this.cover.set(media);
      return;
    }

    this.editor()?.insertImage(media.url, media.alt ?? '');
  }

  protected clearCover(): void {
    this.cover.set(null);
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

    const payload: PostPayload = {
      title: value.title,
      slug: value.slug || '',
      excerpt: value.excerpt || null,
      body: value.body || null,
      status,
      published_at: publishedAt,
      category_id: value.category_id,
      cover_media_id: this.cover()?.id ?? null,
      meta_title: value.meta_title || null,
      meta_description: value.meta_description || null,
      tags: this.selectedTags(),
    };

    this.saving.set(true);
    this.error.set(null);

    const id = this.id();
    const request = id
      ? this.api.updatePost(Number(id), payload)
      : this.api.createPost(payload);

    request.subscribe({
      next: (post) => {
        this.saving.set(false);
        this.flash(status === 'published' ? 'Entrada publicada.' : 'Borrador guardado.');
        this.slug.set(post.slug);

        if (!id) {
          this.router.navigate(['/posts', post.id]);
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

    if (!id || !window.confirm('¿Borrar esta entrada? No se puede deshacer.')) {
      return;
    }

    this.api.deletePost(Number(id)).subscribe({
      next: () => this.router.navigate(['/posts']),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  protected publicUrl(): string {
    return `/blog/${this.slug()}`;
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
