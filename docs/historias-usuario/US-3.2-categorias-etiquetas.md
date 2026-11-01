# US-3.2 — Categorías y etiquetas

| | |
|---|---|
| **Épica** | EP-3 — Entradas |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-3.2](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **clasificar las entradas con una categoría y
varias etiquetas** para **que el blog se pueda explorar por temas**.

## Criterios de aceptación

**Dado** el panel en «Categorías» o «Etiquetas»,
**cuando** creo una con un nombre,
**entonces** aparece en el listado con su slug y el número de entradas.

**Dado** el editor de una entrada,
**cuando** elijo categoría y marco etiquetas,
**entonces** se guardan y la web las muestra y permite filtrar por ellas.

**Dado** una categoría con entradas,
**cuando** la borro,
**entonces** las entradas se conservan sin categoría.

## Definición de Hecho

- Tablas `categories`, `tags` y pivote `post_tag`.
- `HasSlug` también para taxonomías (usa `name` como origen).
- Endpoints públicos `/categories` y `/tags` con contador de publicadas.
- Página de blog filtrable por `?category=` y `?tag=`.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `AdminContentTest::categories_and_tags_can_be_managed` | ✅ |
| `PublicContentTest::posts_can_be_filtered_by_category_and_tag` | ✅ |
