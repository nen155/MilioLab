import { Component, ElementRef, OnDestroy, inject, signal, viewChild } from '@angular/core';

import { I18nService } from '../../core/i18n';
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
          <h2 id="lab-title">{{ i18n.t('lab.title') }}</h2>
          <button class="btn btn-ghost" type="button" (click)="close()">{{ i18n.t('lab.close') }}</button>
        </div>

        <div class="modal-body">
          <div class="lab-tabs" role="tablist" [attr.aria-label]="i18n.t('lab.tabsAria')">
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="lab.tab() === 'reaction'"
              (click)="lab.tab.set('reaction')"
            >
              {{ i18n.t('lab.reaction') }}
            </button>
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="lab.tab() === 'sequence'"
              (click)="lab.tab.set('sequence')"
            >
              {{ i18n.t('lab.sequence') }}
            </button>
          </div>

          @if (lab.tab() === 'reaction') {
            <section [attr.aria-label]="i18n.t('lab.reactionAria')">
              <p class="mono muted">
                {{ i18n.t('lab.reactionHelp') }}
              </p>

              <div class="game-pad">
                @if (!running()) {
                  <button class="btn" type="button" (click)="startReaction()">{{ i18n.t('lab.start') }}</button>
                } @else {
                  <button
                    class="game-target"
                    type="button"
                    [class.ready]="ready()"
                    [attr.aria-label]="ready() ? i18n.t('lab.now') : i18n.t('lab.wait')"
                    (click)="hit()"
                  ></button>
                }
              </div>

              <p class="game-score" aria-live="polite">{{ reactionText() }}</p>
            </section>
          } @else {
            <section [attr.aria-label]="i18n.t('lab.sequenceAria')">
              <p class="mono muted">
                {{ i18n.t('lab.sequenceHelp') }}
              </p>

              <div class="game-pad">
                <div class="simon" role="group" [attr.aria-label]="i18n.t('lab.buttonsAria')">
                  @for (pad of [0, 1, 2, 3]; track pad) {
                    <button
                      type="button"
                      [class.lit]="lit() === pad"
                      [attr.aria-label]="i18n.t('lab.buttonAria', { n: pad + 1 })"
                      (click)="press(pad)"
                    >
                      {{ pad + 1 }}
                    </button>
                  }
                </div>
              </div>

              <p class="game-score" aria-live="polite">{{ sequenceText() }}</p>
              <button class="btn btn-ghost" type="button" style="margin-top: .6rem" (click)="startSequence()">
                {{ i18n.t('lab.restart') }}
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
  protected readonly i18n = inject(I18nService);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');

  // --- Reflejos ------------------------------------------------------------
  protected readonly running = signal(false);
  protected readonly ready = signal(false);
  protected readonly reactionText = signal('');
  private reactionTimer?: ReturnType<typeof setTimeout>;
  private readyAt = 0;

  // --- Secuencia -----------------------------------------------------------
  protected readonly lit = signal<number | null>(null);
  protected readonly sequenceText = signal('');
  private sequence: number[] = [];
  private input: number[] = [];
  private timers: Array<ReturnType<typeof setTimeout>> = [];

  constructor() {
    this.reactionText.set(this.i18n.t('lab.noData'));
    this.sequenceText.set(this.i18n.t('lab.sequenceStart'));
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
    this.reactionText.set(this.i18n.t('lab.waitCircle'));

    this.reactionTimer = setTimeout(() => {
      this.ready.set(true);
      this.readyAt = performance.now();
    }, 900 + Math.random() * 2200);
  }

  protected hit(): void {
    if (!this.ready()) {
      this.reactionText.set(this.i18n.t('lab.early'));
      this.running.set(false);
      this.ready.set(false);
      return;
    }

    const ms = Math.round(performance.now() - this.readyAt);
    this.running.set(false);
    this.ready.set(false);
    this.reactionText.set(this.i18n.t('lab.result', { ms, verdict: this.reactionVerdict(ms) }));
  }

  protected startSequence(): void {
    this.clearTimers();
    this.sequence = [];
    this.input = [];
    this.sequenceText.set(this.i18n.t('lab.observe'));
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
      this.sequenceText.set(this.i18n.t('lab.failStep', { step: index + 1, length: this.sequence.length }));
      this.sequence = [];
      this.input = [];
      return;
    }

    if (this.input.length === this.sequence.length) {
      this.sequenceText.set(this.i18n.t('lab.nextRound', { round: this.sequence.length + 1 }));
      this.timers.push(setTimeout(() => this.nextRound(), 700));
    }
  }

  private nextRound(): void {
    this.input = [];
    this.sequence.push(Math.floor(Math.random() * 4));
    this.playSequence();
  }

  private playSequence(): void {
    this.sequenceText.set(
      this.sequence.length === 1
        ? this.i18n.t('lab.observeOne', { count: this.sequence.length })
        : this.i18n.t('lab.observeMany', { count: this.sequence.length }),
    );

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
      return this.i18n.t('lab.verdictLab');
    }
    if (ms < 320) {
      return this.i18n.t('lab.verdictGood');
    }
    if (ms < 450) {
      return this.i18n.t('lab.verdictOk');
    }

    return this.i18n.t('lab.verdictCoffee');
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
}
