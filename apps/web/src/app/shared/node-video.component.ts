import {
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';

/**
 * «Vídeo» de un nodo: se sintetiza en el navegador a partir del texto del nodo
 * (tipografía cinética + onda). No descarga nada ni necesita un servicio de IA.
 *
 * Respeta `prefers-reduced-motion`: en ese caso pinta un fotograma fijo.
 */
@Component({
  selector: 'app-node-video',
  template: `
    <div class="node-video">
      <canvas #canvas width="320" height="180" role="img" [attr.aria-label]="'Vídeo generado: ' + title()"></canvas>

      <button
        class="node-video-toggle"
        type="button"
        [attr.aria-label]="playing() ? 'Pausar vídeo' : 'Reproducir vídeo'"
        (click)="toggle()"
      >
        {{ playing() ? '❚❚' : '▶' }}
      </button>
    </div>
  `,
})
export class NodeVideoComponent implements OnDestroy {
  readonly title = input.required<string>();
  readonly excerpt = input<string | null>(null);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  protected readonly playing = signal(false);

  private frame = 0;
  private animation?: number;
  private observer?: IntersectionObserver;
  private userPaused = false;
  private visible = true;
  private readonly reduced =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    effect(() => {
      this.title();
      this.excerpt();
      this.frame = 0;

      // Espera a que el canvas exista en el DOM.
      queueMicrotask(() => {
        this.paint();
        this.observe();
        if (!this.reduced && this.visible) {
          this.play();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.stop();
  }

  protected toggle(): void {
    if (this.playing()) {
      this.userPaused = true;
      this.stop();
    } else {
      this.userPaused = false;
      this.play();
    }
  }

  /** Pausa los vídeos que salen de pantalla (rendimiento y batería). */
  private observe(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;

        if (!this.visible) {
          this.stop();
        } else if (!this.reduced && !this.userPaused) {
          this.play();
        }
      },
      { threshold: 0.25 },
    );

    this.observer.observe(this.canvas().nativeElement);
  }

  private play(): void {
    if (this.reduced || this.animation) {
      return;
    }

    this.playing.set(true);
    const loop = () => {
      this.frame += 0.016;
      this.paint();
      this.animation = requestAnimationFrame(loop);
    };
    this.animation = requestAnimationFrame(loop);
  }

  private stop(): void {
    if (this.animation) {
      cancelAnimationFrame(this.animation);
      this.animation = undefined;
    }
    this.playing.set(false);
  }

  private paint(): void {
    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const { width, height } = canvas;
    const seed = this.hash(this.title());
    const hue = 250 + (seed % 40);

    ctx.fillStyle = `hsl(${hue} 40% 10%)`;
    ctx.fillRect(0, 0, width, height);

    // Onda «de audio» determinista.
    const t = this.frame;
    ctx.strokeStyle = `hsl(${hue} 80% 65% / 0.8)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let x = 0; x < width; x += 4) {
      const y = height * 0.72 + Math.sin(x * 0.05 + t * 2 + seed) * 12 * Math.sin(t + x * 0.01);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Punto que recorre la onda.
    const px = (t * 60) % width;
    ctx.fillStyle = `hsl(${hue} 90% 72%)`;
    ctx.beginPath();
    ctx.arc(px, height * 0.72, 3, 0, Math.PI * 2);
    ctx.fill();

    // Tipografía cinética: palabras que aparecen una a una.
    const words = this.title().split(/\s+/).slice(0, 6);
    const step = Math.floor(t * 2) % (words.length + 1);

    ctx.font = '600 22px Georgia, serif';
    ctx.fillStyle = 'rgba(241, 236, 255, 0.95)';

    words.slice(0, Math.max(1, step)).forEach((word, index) => {
      const y = 34 + index * 24;
      if (y > height * 0.55) {
        return;
      }
      ctx.fillText(word, 16, y);
    });

    if (this.excerpt()) {
      ctx.font = '10px ui-monospace, monospace';
      ctx.fillStyle = 'rgba(154, 143, 192, 0.9)';
      ctx.fillText('nodo · vídeo generado', 16, height - 12);
    }
  }

  private hash(value: string): number {
    let hash = 0;

    for (let i = 0; i < value.length; i += 1) {
      hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }

    return hash;
  }
}
