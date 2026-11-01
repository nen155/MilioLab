# US-6.5 — SEO técnico: metadatos, sitemap y RSS

| | |
|---|---|
| **Épica** | EP-6 — Web pública |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-6.6](../06-requisitos.md), [RF-6.7](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **que el sitio se indexe bien y se pueda
suscribir** para **llegar a más gente sin trabajo manual**.

## Criterios de aceptación

**Dado** cualquier página pública,
**cuando** se abre,
**entonces** tiene `<title>`, meta descripción, `og:*`, `twitter:card` y `canonical`.

**Dado** `https://miliolab.com/sitemap.xml`,
**cuando** lo pido,
**entonces** devuelve XML con portada, blog, páginas, entradas y categorías.

**Dado** `https://miliolab.com/feed.xml`,
**cuando** lo pido,
**entonces** devuelve RSS 2.0 con las 20 últimas entradas.

**Dado** una entrada,
**cuando** la rastrea un buscador,
**entonces** encuentra JSON-LD `BlogPosting` con fecha, autor e imagen.

## Definición de Hecho

- `SeoService` (Angular) para título, metadatos, canonical y JSON-LD.
- `SitemapController` y `FeedController` en la API.
- Reglas de Apache que publican `/sitemap.xml` y `/feed.xml` desde la API.
- `robots` y enlace `alternate` al RSS en la web.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `GET /sitemap` | XML con páginas y entradas ✅ |
| `GET /feed` | RSS con título, enlace y fechas ✅ |
| Metadatos en la web | título por página y `og:image` con la portada ✅ |
