import { Component, ElementRef, OnDestroy, computed, inject, signal, viewChild } from '@angular/core';

import { LabService } from '../../core/lab.service';

@Component({
  selector: 'app-lab-panel',
  template: `
    <div class="modal-backdrop" (click)="close()">
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-title"
        (click)="$event.stopPropagation()"
        (keydown.escape)="close()"
        #dialog
      >
        <div class="modal-head">
          <h2 id="lab-title">Sala de experimentos</h2>
          <button class="btn btn-ghost" type="button" (click)="close()">Cerrar (Esc)</button>
        </div>

        <div class="modal-body">
          <div class="lab-tabs" role="tablist" aria-label="Experimentos">
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="lab.tab() === 'reaction'"
              (click)="lab.tab.set('reaction')"
            >
              Reflejos
            </button>
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="lab.tab() === 'sequence'"
              (click)="lab.tab.set('sequence')"
            >
              Secuencia
            </button>
          </div>

          @if (lab.tab() === 'reaction') {
            <section aria-label="Prueba de reflejos">
              <p class="mono muted">
                Pulsa «Empezar» y, cuando el círculo se ilumine, pulsa el botón (o la barra
                espaciadora) lo antes posible.
              </p>

              <div class="game-pad">
                @if (!running()) {
                  <button class="btn" type="button" (click)="startReaction()">Empezar</button>
                } @else {
                  <button
                    class="game-target"
                    type="button"
                    [class.ready]="ready()"
                    [attr.aria-label]="ready() ? '¡Ahora!' : 'Espera…'"
                    (click)="hit()"
                  ></button>
                }
              </div>

              <p class="game-score" aria-live="polite">{{ reactionText() }}</p>
            </section>
          } @else {
            <section aria-label="Juego de secuencia">
              <p class="mono muted">
                Repite la secuencia. Puedes usar los botones o las teclas 1, 2, 3 y 4.
              </p>

              <div class="game-pad">
                <div class="simon" role="group" aria-label="Cuatro botones de secuencia">
                  @for (pad of [0, 1, 2, 3]; track pad) {
                    <button
                      type="button"
                      [class.lit]="lit() === pad"
                      [attr.aria-label]="'Botón ' + (pad + 1)"
                      (click)="press(pad)"
                    >
                      {{ pad + 1 }}
                    </button>
                  }
                </div>
              </div>

              <p class="game-score" aria-live="polite">{{ sequenceText() }}</p>
              <button class="btn btn-ghost" type="button" style="margin-top: .6rem" (click)="startSequence()">
                Reiniciar
              </button>
            </section>
          }
        </div>
      </div>
    </div>
  `,
})
export class LabPanelComponent implements OnDestroy {
  protected readonly lab = inject(LabService);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');

  // --- Reflejos ------------------------------------------------------------
  protected readonly running = signal(false);
  protected readonly ready = signal(false);
  protected readonly reactionText = signal('Sin datos todavía.');
  private reactionTimer?: ReturnType<typeof setTimeout>;
  private readyAt = 0;

  // --- Secuencia -----------------------------------------------------------
  protected readonly lit = signal<number | null>(null);
  protected readonly sequenceText = signal('Pulsa «Reiniciar» para empezar.');
  private sequence: number[] = [];
  private input: number[] = [];
  private timers: Array<ReturnType<typeof setTimeout>> = [];

  constructor() {
    setTimeout(() => this.dialog()?.nativeElement.focus(), 0);
    document.addEventListener('keydown', this.onKey);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKey);
    this.clearTimers();
  }

  protected close(): void {
    this.clearTimers();
    this.running.set(false);
    this.lab.hide();
  }

  protected startReaction(): void {
    this.running.set(true);
    this.ready.set(false);
    this.reactionText.set('Espera al círculo…');

    this.reactionTimer = setTimeout(() => {
      this.ready.set(true);
      this.readyAt = performance.now();
    }, 900 + Math.random() * 2200);
  }

  protected hit(): void {
    if (!this.ready()) {
      this.reactionText.set('Te has adelantado. Vuelve a intentarlo.');
      this.running.set(false);
      this.ready.set(false);
      return;
    }

    const ms = Math.round(performance.now() - this.readyAt);
    this.running.set(false);
    this.ready.set(false);
    this.reactionText.set(`${ms} ms. ${this.reactionVerdict(ms)}`);
  }

  protected startSequence(): void {
    this.clearTimers();
    this.sequence = [];
    this.input = [];
    this.sequenceText.set('Observa la secuencia…');
    this.nextRound();
  }

  protected press(pad: number): void {
    if (this.sequence.length === 0) {
      return;
    }

    this.lit.set(pad);
    this.timers.push(setTimeout(() => this.lit.set(null), 180));

    this.input.push(pad);
    const index = this.input.length - 1;

    if (this.input[index] !== this.sequence[index]) {
      this.sequenceText.set(`Fallaste en el paso ${index + 1}. Longitud alcanzada: ${this.sequence.length}.`);
      this.sequence = [];
      this.input = [];
      return;
    }

    if (this.input.length === this.sequence.length) {
      this.sequenceText.set(`Bien. Siguiente ronda (${this.sequence.length + 1}).`);
      this.timers.push(setTimeout(() => this.nextRound(), 700));
    }
  }

  private nextRound(): void {
    this.input = [];
    this.sequence.push(Math.floor(Math.random() * 4));
    this.playSequence();
  }

  private playSequence(): void {
    this.sequenceText.set(`Observa: ${this.sequence.length} ${this.sequence.length === 1 ? 'paso' : 'pasos'}.`);

    this.sequence.forEach((pad, index) => {
      this.timers.push(
        setTimeout(() => {
          this.lit.set(pad);
          this.timers.push(setTimeout(() => this.lit.set(null), 260));
        }, 420 * index + 250),
      );
    });
  }

  private reactionVerdict(ms: number): string {
    if (ms < 220) {
      return 'Nivel laboratorio.';
    }
    if (ms < 320) {
      return 'Buen reflejo.';
    }
    if (ms < 450) {
      return 'Aceptable.';
    }

    return 'Café pendiente.';
  }

  private clearTimers(): void {
    clearTimeout(this.reactionTimer);
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.lit.set(null);
  }

  private readonly onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (this.lab.tab() === 'reaction' && event.code === 'Space' && this.running()) {
      event.preventDefault();
      this.hit();
      return;
    }

    if (this.lab.tab() === 'sequence' && ['1', '2', '3', '4'].includes(event.key)) {
      event.preventDefault();
      this.press(Number(event.key) - 1);
    }
  };

  protected readonly title = computed(() => (this.lab.tab() === 'reaction' ? 'Reflejos' : 'Secuencia'));
}
