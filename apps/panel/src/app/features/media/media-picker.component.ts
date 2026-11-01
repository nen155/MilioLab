import { Component, OnInit, inject, output, signal } from '@angular/core';

import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/errors';
import { Media } from '../../core/models';

@Component({
  selector: 'app-media-picker',
  template: `
    <div class="modal-backdrop" (click)="closed.emit()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-head">
          <h2>Elegir imagen</h2>
          <button class="btn btn-sm" type="button" (click)="closed.emit()">Cerrar</button>
        </div>

        <div class="modal-body">
          @if (error()) {
            <div class="alert alert-error">{{ error() }}</div>
          }

          <label
            class="dropzone"
            [class.dragging]="dragging()"
            (dragover)="onDragOver($event)"
            (dragleave)="dragging.set(false)"
            (drop)="onDrop($event)"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              (change)="onFileInput($event)"
            />
            <strong>{{ uploading() ? 'Subiendo…' : 'Subir una imagen' }}</strong>
            <span class="small">Arrástrala aquí o pulsa para elegirla (máx. 10 MB)</span>
          </label>

          @if (loading()) {
            <p class="muted small">Cargando multimedia…</p>
          } @else if (media().length === 0) {
            <p class="empty">Todavía no hay imágenes. Sube la primera.</p>
          } @else {
            <div class="media-grid" style="margin-top: 1rem">
              @for (item of media(); track item.id) {
                <button type="button" class="media-item" (click)="choose(item)">
                  <span class="media-thumb">
                    <img [src]="item.url" [alt]="item.alt || item.filename" loading="lazy" />
                  </span>
                  <span class="media-name">{{ item.filename }}</span>
                </button>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class MediaPickerComponent implements OnInit {
  readonly selected = output<Media>();
  readonly closed = output<void>();

  private readonly api = inject(ApiService);

  protected readonly media = signal<Media[]>([]);
  protected readonly loading = signal(true);
  protected readonly uploading = signal(false);
  protected readonly dragging = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected choose(item: Media): void {
    this.selected.emit(item);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files?.[0];

    if (file) {
      this.upload(file);
    }
  }

  protected onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.upload(file);
    }

    input.value = '';
  }

  private load(): void {
    this.loading.set(true);

    this.api.media({ per_page: 60, type: 'image' }).subscribe({
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
      },
      error: (error) => {
        this.uploading.set(false);
        this.error.set(errorMessage(error, 'No se pudo subir el archivo.'));
      },
    });
  }
}
