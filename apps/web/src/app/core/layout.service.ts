import { Injectable, computed, signal } from '@angular/core';

export type Layout = 'notebook' | 'cards' | 'sketch' | 'hud';

const LAYOUTS: Layout[] = ['notebook', 'cards', 'sketch', 'hud'];

/**
 * Diseño activo. No es solo una paleta: cada layout cambia la estructura de la
 * página (raíl, nodos, línea de tiempo y escenario). El tema elige uno.
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly state = signal<Layout>('notebook');

  readonly layout = this.state.asReadonly();
  readonly isNotebook = computed(() => this.state() === 'notebook');
  readonly isCards = computed(() => this.state() === 'cards');
  readonly isSketch = computed(() => this.state() === 'sketch');
  readonly isHud = computed(() => this.state() === 'hud');

  set(value: string | null | undefined): void {
    this.state.set(LAYOUTS.includes(value as Layout) ? (value as Layout) : 'notebook');
  }
}
