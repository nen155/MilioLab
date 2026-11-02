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

## Temas

Los temas viven en la tabla `themes` y se gestionan en el panel (**Temas**). El tema
activo se sirve en `GET /api/v1/site` (`theme.tokens`, `theme.layout` y
`theme.config`) y la web los aplica como variables CSS en `:root`, como
`data-layout` en `<html>` y como datos del raíl. Se pueden **exportar e importar**
como JSON:

```json
{
  "name": "Papel viejo",
  "layout": "notebook",
  "tokens": { "--paper": "#f4efe3", "--ink": "#1b1a17", "--accent": "#8b5e34" },
  "config": {
    "rail": {
      "subtitle": "ingeniería de software",
      "items": [
        { "label": "proyecto", "value": "ML-2026" },
        { "label": "estado", "value": "abierto" }
      ]
    }
  }
}
```

Solo se aceptan las claves de `Theme::ALLOWED_TOKENS`; los valores con `{}`, `;`, `<` o
`>` se descartan (un tema importado no puede inyectar CSS). La `config` solo admite
`rail` con `aria`, `subtitle`, `type`, `foot` e `items`; cualquier otra clave se
descarta y el texto se limpia.

**Añadir un tema no requiere tocar el frontend.** La web pinta un único raíl
(`SiteRailComponent`), un único escenario con las tres capas (`SceneryComponent`) y
un único mapa de nodos; el CSS decide qué se ve con `data-layout`. Los textos del
raíl salen de `config.rail` o, si no existe, de los valores por defecto. El panel
tampoco tiene los layouts escritos a mano: los recibe de
`GET /api/v1/admin/themes` (`layouts`).

## Diseños (layout)

Un tema no es solo una paleta. El campo `layout` elige uno de los cuatro sistemas de
diseño de `apps/web/src/layouts.css`; cada uno cambia la **estructura** de la página,
no solo los colores. Los tokens del tema siguen mandando en el color, así que cualquier
tema se puede combinar con cualquier diseño.

| `layout` | Escenario | Raíl | Nodos | Línea de tiempo |
|---|---|---|---|---|
| `notebook` | Papel milimetrado | Datos de la libreta | Grafo con puertos | Regla con hitos |
| `sketch` | Roca, cordillera y sol | Datos del proyecto con cordada de fondo | **Presas de roca** orgánicas, con tornillo y cinta | **Cuerda** trenzada con mosquetones |
| `cards` | Mesa de fieltro y cartas al fondo | Ficha de autor con marco dorado | **Mano de cartas** superpuestas, con pips y línea de tipo | Edición con joyas romboidales |
| `hud` | Consola táctica, rejilla y líneas de escaneo | Panel de proyecto con estado | Objetivos con esquinas recortadas y radar | Registro de proyecto con marcas |

- No hay `switch` por layout en los componentes: el raíl, el escenario y el mapa de
  nodos son únicos y el CSS muestra u oculta sus adornos con `[data-layout="…"]`.
- Las tarjetas y los nodos añaden marcado específico (pips, línea de tipo,
  cinta de papel, tornillo) que solo se muestra en su diseño.
- La línea de tiempo es la misma en todas las páginas; el CSS la convierte en cuerda,
  edición o registro según `data-layout`.

**Añadir un layout nuevo** (una estructura distinta, no solo otra paleta) sigue
necesitando CSS en `layouts.css` y registrar su clave en `Theme::LAYOUTS` y
`Theme::LAYOUT_LABELS`; el panel lo mostrará automáticamente. Lo que ya no hace falta
es añadir un `@switch` en Angular.

Temas de ejemplo del seeder: *Cuaderno de laboratorio* (`notebook`), *Nodos* y
*Granito* (`sketch`), *Marco dorado* (`cards`) y *Consola* (`hud`).

## Tema «Nodos»

Tema morado de noche: la misma estructura de roca que *Granito*, pero con
roca oscura y tiza violeta. Los nodos muestran la **portada** de la entrada cuando
existe. El vídeo sintetizado por nodo se retiró (US-11.2); el hueco está preparado
para un clip generado por IA en el futuro.

## Rendimiento

Build de producción: **121,6 KB** de transferencia inicial. El sistema de layouts
(`layouts.css`) añade unos 7 KB de CSS; `marked` solo se carga en las páginas de
contenido.
