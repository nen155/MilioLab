import { Injectable, signal } from '@angular/core';

/** Estado compartido de la «sala de experimentos» (minijuegos). */
@Injectable({ providedIn: 'root' })
export class LabService {
  readonly open = signal(false);
  readonly tab = signal<'reaction' | 'sequence'>('reaction');

  show(tab?: 'reaction' | 'sequence'): void {
    if (tab) {
      this.tab.set(tab);
    }
    this.open.set(true);
  }

  hide(): void {
    this.open.set(false);
  }

  toggle(): void {
    this.open.update((value) => !value);
  }
}
