# US-6.2 — Blog con filtros, paginación y buscador

| | |
|---|---|
| **Épica** | EP-6 — Web pública |
| **Rol** | Visitante |
| **Requisitos** | [RF-6.3](../06-requisitos.md), [RF-6.4](../06-requisitos.md) |

## Descripción

Como **visitante** quiero **explorar las entradas por categoría, etiqueta o texto** para
**encontrar lo que me interesa sin recorrer todo el blog**.

## Criterios de aceptación

**Dado** el blog,
**cuando** lo abro,
**entonces** veo las entradas paginadas (9 por defecto) con su categoría y tiempo de
lectura.

**Dado** una categoría o etiqueta,
**cuando** pulso su enlace,
**entonces** el listado se filtra y el título lo indica.

**Dado** el buscador de la cabecera,
**cuando** escribo un término y envío,
**entonces** veo los resultados y el texto buscado en el título.

**Dado** una búsqueda sin resultados,
**cuando** se completa,
**entonces** veo un estado vacío con enlace al inicio.

## Definición de Hecho

- `GET /api/v1/posts` con `page`, `per_page`, `category`, `tag` y `q`.
- Listado con chips de categorías, paginación y skeletons de carga.
- Buscador en la cabecera que navega a `/blog?q=…`.
- SEO del listado según el filtro activo.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `PublicContentTest` (listado, filtros y categorías) | ✅ |
| Blog real | 3 entradas, chips y paginación oculta con una página ✅ |
