# US-i18n-contenido — Contenido bilingüe (es/en)

| | |
|---|---|
| **Épica** | EP-11 — Contenido |
| **Rol** | Autor / visitante |
| **Requisitos** | [RF-13.2](../06-requisitos.md) |

## Descripción

Como **autor** quiero **escribir el contenido del sitio en español y en inglés**
para que **un visitante angloparlante lea la misma página, entrada o ficha en su
idioma** sin duplicar rutas ni mantener dos sitios.

## Criterios de aceptación

**Dado** una entrada con título, entradilla, cuerpo y SEO en inglés,
**cuando** la web está en inglés,
**entonces** muestra esos textos; si algún campo inglés está vacío, muestra el
español como respaldo.

**Dado** una página, categoría, etiqueta o enlace de menú con su versión inglesa,
**cuando** la web está en inglés,
**entonces** usa la versión inglesa en el contenido, las tarjetas, los filtros y
la navegación.

**Dado** los ajustes del sitio (`site_tagline`, `site_description`, `footer_text`,
`blog_title`, `blog_intro`),
**cuando** existen las claves `*_en`,
**entonces** la web en inglés las usa y cae a las españolas si faltan.

**Dado** las páginas estáticas del portfolio (proyectos y habilidades),
**cuando** la web está en inglés,
**entonces** periodos, roles, resúmenes, notas y etiquetas de área aparecen en
inglés.

**Dado** el panel de administración,
**cuando** edito una entrada, página, categoría, etiqueta, menú o ajuste,
**entonces** dispongo de los campos en inglés junto a los españoles.

## Definición de Hecho

- [x] Migración reversible con columnas `*_en` en `posts`, `pages`,
  `menu_items`, `categories` y `tags`.
- [x] Modelos, `FormRequest`, controladores y `Resource` actualizados; el HTML
  inglés pasa por el mismo saneador que el español.
- [x] Búsqueda pública sobre título, entradilla y cuerpo en ambos idiomas.
- [x] Panel con campos ingleses en entradas, páginas, taxonomías, menú y ajustes.
- [x] Datos estáticos del portfolio bilingües y resueltos por idioma.
- [x] Seeder con contenido de ejemplo en inglés.
- [x] Tests de API para creación, lectura pública y ajustes en inglés.
- [x] Documentación de modelo de datos y API actualizada.

## Notas de implementación

- Se reutiliza el `slug` para ambas versiones: la URL no cambia al cambiar de
  idioma.
- Los campos ingleses son opcionales (`nullable`) y la web aplica *fallback* al
  español.
- Los ajustes ingleses son claves nuevas (`site_tagline_en`, etc.), no columnas.
- Las categorías y etiquetas conservan su `slug` español para no romper enlaces.
- El tiempo de lectura inglés (`reading_minutes_en`) se calcula sobre `body_en` y
  cae al español si ese cuerpo está vacío.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `php artisan test` (suite completa) | 48 tests, 166 assertions ✅ |
| `/api/v1/site`, `/api/v1/posts/{slug}` y `/api/v1/pages/{slug}` | devuelven `title_en`, `body_en`, `label_en`, `name_en` y `reading_minutes_en` ✅ |
| Búsqueda `?q=` en inglés | encuentra entradas por `title_en`/`body_en` ✅ |
| Web en inglés | títulos, entradillas, cuerpos, categorías, menú, fechas y portfolio en inglés ✅ |
| Panel | campos ingleses visibles y guardables en entrada, página, menú, taxonomías y ajustes ✅ |
| `npm run build` de `apps/web` y `apps/panel` | builds correctos ✅ |

## Trazabilidad

- Requisito nuevo [RF-13.2](../06-requisitos.md).
- Depende de [US-i18n-UI](US-i18n-UI.md) para el selector y la resolución de
  idioma en la web.
