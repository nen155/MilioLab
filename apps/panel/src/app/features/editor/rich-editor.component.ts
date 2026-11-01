import {
  Component,
  ElementRef,
  OnDestroy,
  forwardRef,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Editor } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';

/**
 * Editor WYSIWYG (TipTap) que guarda HTML.
 *
 * Implementa `ControlValueAccessor`, así que se usa directamente con
 * `formControlName` dentro de un formulario reactivo.
 */
@Component({
  selector: 'app-rich-editor',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichEditorComponent),
      multi: true,
    },
  ],
  template: `
    <div class="editor">
      <div class="editor-toolbar" role="toolbar" aria-label="Formato">
        <button type="button" [class.is-active]="active('bold')" (click)="run('toggleBold')" title="Negrita">
          <strong>B</strong>
        </button>
        <button type="button" [class.is-active]="active('italic')" (click)="run('toggleItalic')" title="Cursiva">
          <em>I</em>
        </button>
        <button type="button" [class.is-active]="active('underline')" (click)="run('toggleUnderline')" title="Subrayado">
          <u>U</u>
        </button>
        <button type="button" [class.is-active]="active('strike')" (click)="run('toggleStrike')" title="Tachado">
          <s>S</s>
        </button>
        <button type="button" [class.is-active]="active('heading', { level: 2 })" (click)="run('toggleHeading', { level: 2 })" title="Título">
          H2
        </button>
        <button type="button" [class.is-active]="active('heading', { level: 3 })" (click)="run('toggleHeading', { level: 3 })" title="Subtítulo">
          H3
        </button>
        <button type="button" [class.is-active]="active('bulletList')" (click)="run('toggleBulletList')" title="Lista">
          • Lista
        </button>
        <button type="button" [class.is-active]="active('orderedList')" (click)="run('toggleOrderedList')" title="Lista numerada">
          1. Lista
        </button>
        <button type="button" [class.is-active]="active('blockquote')" (click)="run('toggleBlockquote')" title="Cita">
          ❝
        </button>
        <button type="button" [class.is-active]="active('codeBlock')" (click)="run('toggleCodeBlock')" title="Código">
          &lt;/&gt;
        </button>
        <button type="button" (click)="link()" title="Enlace">Enlace</button>
        <button type="button" (click)="imageRequest.emit()" title="Imagen">Imagen</button>
        <button type="button" (click)="run('setTextAlign', 'center')" title="Centrar">≡</button>
        <span class="spacer"></span>
        <button type="button" (click)="run('undo')" title="Deshacer">↶</button>
        <button type="button" (click)="run('redo')" title="Rehacer">↷</button>
      </div>

      <div class="editor-content" #host></div>
    </div>
  `,
})
export class RichEditorComponent implements ControlValueAccessor, OnDestroy {
  /** El padre abre el selector de multimedia y llama a `insertImage`. */
  readonly imageRequest = output<void>();

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private readonly revision = signal(0);
  private editor?: Editor;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private pendingValue: string | null = null;
  private applyingExternal = false;

  constructor() {
    queueMicrotask(() => this.create());
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  // --- ControlValueAccessor ------------------------------------------------

  writeValue(value: string | null): void {
    const html = value ?? '';

    if (this.editor) {
      this.setContent(html);
    } else {
      this.pendingValue = html;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.editor?.setEditable(!disabled);
  }

  // --- API pública ---------------------------------------------------------

  /** Inserta una imagen en la posición actual del cursor. */
  insertImage(url: string, alt = ''): void {
    this.editor?.chain().focus().setImage({ src: url, alt }).run();
  }

  // --- Plantilla -----------------------------------------------------------

  protected run(command: string, ...args: unknown[]): void {
    const chain = this.editor?.chain().focus() as unknown as Record<
      string,
      (...params: unknown[]) => { run: () => void }
    >;

    chain?.[command]?.(...args)?.run();
  }

  protected active(name: string, attributes?: Record<string, unknown>): boolean {
    this.revision();

    return this.editor?.isActive(name, attributes) ?? false;
  }

  private create(): void {
    this.editor = new Editor({
      element: this.host().nativeElement,
      extensions: [
        StarterKit,
        Image.configure({ inline: false, allowBase64: false }),
        Placeholder.configure({ placeholder: 'Escribe aquí…' }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ],
      content: this.pendingValue ?? '',
      onUpdate: ({ editor }) => {
        if (!this.applyingExternal) {
          this.onChange(editor.getHTML());
        }
      },
      onTransaction: () => this.revision.update((value) => value + 1),
      onBlur: () => this.onTouched(),
    });

    if (this.pendingValue !== null) {
      this.setContent(this.pendingValue);
      this.pendingValue = null;
    }
  }

  private setContent(html: string): void {
    if (!this.editor || html === this.editor.getHTML()) {
      return;
    }

    this.applyingExternal = true;
    this.editor.commands.setContent(html, { emitUpdate: false });
    this.applyingExternal = false;
  }

  private link(): void {
    const previous = this.editor?.getAttributes('link')['href'] as string | undefined;
    const url = window.prompt('Dirección del enlace', previous ?? 'https://');

    if (url === null) {
      return;
    }

    if (url === '') {
      this.run('extendMarkRange', 'link');
      this.run('unsetLink');
      return;
    }

    this.run('extendMarkRange', 'link');
    this.run('setLink', { href: url });
  }
}
