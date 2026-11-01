# Diseño «cuaderno de laboratorio» — MilioLab

> Rediseño completo de la web pública. El panel y la API no cambian.

## Concepto

La web se presenta como el **cuaderno de laboratorio** de quien escribe: papel
milimetrado, tinta, etiquetas de muestra y notas al margen. Nada de tarjetas
flotantes ni degradados: líneas, marcas de esquina y tipografía con carácter.

| Idea del brief | Cómo se resuelve |
|---|---|
| Laboratorio | Raíl lateral con «muestra ML-2026», estado, autor y método; rejilla de papel; etiquetas monoespaciadas `ML-001`. |
| Markdown | El contenido se interpreta como Markdown si el cuerpo no empieza por una etiqueta HTML (`ContentPipe` + `marked`). |
| Legible para recruiters | Jerarquía clara, texto de 68 caracteres por línea, índice, versión texto y metadatos de cada entrada. |
| Easter eggs al pasar el ratón | Notas ocultas en `span.egg` (método, muestras, residuo) y notas por tarjeta que aparecen al hacer hover/focus. |
| Minijuegos ocultos | «Sala de experimentos» con **Reflejos** y **Secuencia** (Shift + L o enlace «experimentos» del pie). |
| Legible para un robot/IA | `/texto` (índice completo), `/llms.txt`, `sitemap.xml`, RSS, JSON-LD, `<noscript>` con alternativas. |
| Accesibilidad | Contraste AA, foco visible, `skip-link`, `aria-live` en los juegos, teclado completo, `prefers-reduced-motion`. |
| Diseño rompedor | Sistema propio de tokens, raíl de libreta, tarjetas «muestra» con esquina marcada y tipografía serif + mono. |

## Tokens

```css
--paper #f6f3ea · --ink #17161a · --accent (configurable desde el panel)
--grid 24px · --measure 68ch · --rail 168px
--font-serif (títulos) · --font-sans (texto) · --font-mono (etiquetas)
```

Modo oscuro automático con `prefers-color-scheme`; el acento sale de
`accent_color` en los ajustes del sitio.

## Componentes

- **Raíl** (`app-root`): datos de la libreta; oculto en móvil.
- **Cabecera**: marca con sello circular, badge `LAB-01`, índice y buscador.
- **Muestra** (`app-post-card`): número, fecha, portada, título, extracto y nota al hover.
- **Artículo/página**: cabecera con `kicker`, metadatos y prosa de 68ch.
- **Pie**: índice, señales (GitHub, RSS, `llms.txt`) y puerta a los experimentos.

## Accesibilidad

- Enlace «Saltar al contenido» y `main#contenido` con `tabindex="-1"`.
- Las notas ocultas se muestran también con `:focus-visible` (no solo hover).
- Los juegos funcionan con teclado: `Espacio` (reflejos) y `1–4` (secuencia);
  resultados en `aria-live="polite"`; el diálogo se cierra con `Esc`.
- Animaciones desactivadas con `prefers-reduced-motion`.

## Máquinas

- `/texto`: índice completo en Markdown dentro de un `<pre>`.
- `/llms.txt`: descripción del sitio y enlaces canónicos.
- `robots.txt` + `sitemap.xml` + `feed.xml`.
- JSON-LD `WebSite` y `BlogPosting`.

## Rendimiento

Build de producción: **95,6 KB** de transferencia inicial (antes 78 KB; el
incremento es `marked`, que solo se carga en las páginas de contenido).
