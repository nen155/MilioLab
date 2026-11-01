# US-2.2 — Publicación y programación de páginas

| | |
|---|---|
| **Épica** | EP-2 — Páginas |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-2.3](../06-requisitos.md), [RF-2.5](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **dejar páginas en borrador, publicarlas o
fecharlas** para **preparar contenido sin que se vea antes de tiempo**.

## Criterios de aceptación

**Dado** una página en borrador,
**cuando** alguien abre su URL en la web,
**entonces** recibe un 404 (la API solo expone publicadas).

**Dado** una página publicada sin fecha,
**cuando** guardo,
**entonces** la fecha de publicación se fija automáticamente.

**Dado** una página con metadatos SEO propios,
**cuando** se abre en la web,
**entonces** el `<title>` y la meta descripción usan esos valores.

## Definición de Hecho

- `status` (`draft`/`published`) y `published_at` en el modelo y la API.
- `scopePublished` filtra por estado y fecha.
- Campos `meta_title` y `meta_description` en el editor y en la ficha de la página.
- El panel ofrece «Guardar borrador» y «Publicar».

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `PublicContentTest::a_draft_page_is_not_public` | 404 ✅ |
| `AdminContentTest` (publicación) | `published_at` generado ✅ |
