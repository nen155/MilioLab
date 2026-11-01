import { Component, OnInit, inject, signal } from '@angular/core';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { Media } from '../../core/models';

@Component({
  selector: 'app-media-library',
  template: `
    <header class="page-head">
      <div>
        <h1>Multimedia</h1>
        <p>Imágenes y documentos que puedes usar en las entradas y páginas.</p>
      </div>
    </header>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }
    @if (notice()) {
      <div class="alert alert-ok">{{ notice() }}</div>
    }

    <div class="card">
      <label
        class="dropzone"
        [class.dragging]="dragging()"
        (dragover)="onDragOver($event)"
        (dragleave)="dragging.set(false)"
        (drop)="onDrop($event)"
      >
        <input type="file" accept="image/*,application/pdf" hidden (change)="onFileInput($event)" />
        <strong>{{ uploading() ? 'Subiendo…' : 'Subir archivos' }}</strong>
        <span class="small">Arrastra aquí o pulsa para elegir (JPG, PNG, WebP, GIF, SVG o PDF · máx. 10 MB)</span>
      </label>
    </div>

    <div class="card">
      @if (loading()) {
        <p class="muted">Cargando…</p>
      } @else if (media().length === 0) {
        <p class="empty">No hay archivos todavía.</p>
      } @else {
        <div class="media-grid">
          @for (item of media(); track item.id) {
            <figure class="media-item">
              <span class="media-thumb">
                @if (item.is_image) {
                  <img [src]="item.url" [alt]="item.alt || item.filename" loading="lazy" />
                } @else {
                  <span class="muted small">PDF</span>
                }
              </span>
              <figcaption class="media-name" [title]="item.filename">{{ item.filename }}</figcaption>
              <div class="row" style="padding: 0 0.5rem 0.5rem">
                <button class="btn btn-sm" type="button" (click)="copy(item)">Copiar URL</button>
                <button class="btn btn-sm btn-danger" type="button" (click)="remove(item)">Borrar</button>
              </div>
            </figure>
          }
        </div>
      }
    </div>
  `,
})
export class MediaLibraryComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly media = signal<Media[]>([]);
  protected readonly loading = signal(true);
  protected readonly uploading = signal(false);
  protected readonly dragging = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const files = Array.from(event.dataTransfer?.files ?? []);
    files.forEach((file) => this.upload(file));
  }

  protected onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    Array.from(input.files ?? []).forEach((file) => this.upload(file));
    input.value = '';
  }

  protected copy(item: Media): void {
    navigator.clipboard?.writeText(item.url).then(
      () => this.flash('URL copiada al portapapeles.'),
      () => this.flash('No se pudo copiar la URL.'),
    );
  }

  protected remove(item: Media): void {
    if (!window.confirm(`¿Borrar «${item.filename}»? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.api.deleteMedia(item.id).subscribe({
      next: () => this.media.update((items) => items.filter((m) => m.id !== item.id)),
      error: (error) => this.error.set(errorMessage(error)),
    });
  }

  private load(): void {
    this.loading.set(true);

    this.api.media({ per_page: 60 }).subscribe({
      next: (response) => {
        this.media.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });
  }

  private upload(file: File): void {
    this.uploading.set(true);
    this.error.set(null);

    this.api.uploadMedia(file).subscribe({
      next: (media) => {
        this.uploading.set(false);
        this.media.update((items) => [media, ...items]);
        this.flash(`«${media.filename}» subido.`);
      },
      error: (error) => {
        this.uploading.set(false);
        this.error.set(errorMessage(error, 'No se pudo subir el archivo.'));
      },
    });
  }

  private flash(message: string): void {
    this.notice.set(message);
    setTimeout(() => this.notice.set(null), 2500);
  }
}
