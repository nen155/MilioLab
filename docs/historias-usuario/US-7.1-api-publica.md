# US-7.1 — API pública versionada

| | |
|---|---|
| **Épica** | EP-7 — API y calidad |
| **Rol** | Desarrolladora/or |
| **Requisitos** | [RF-7.1](../06-requisitos.md) |

## Descripción

Como **desarrolladora/or** quiero **una API pública versionada y de solo lectura** para
**alimentar la web (y futuros clientes) sin acoplarlos a la base de datos**.

## Criterios de aceptación

**Dado** `GET /api/v1/site`,
**cuando** lo pido sin token,
**entonces** devuelve ajustes públicos, menú, página de inicio y últimas entradas.

**Dado** `GET /api/v1/posts?category=noticias&per_page=9`,
**cuando** lo pido,
**entonces** devuelve solo publicadas con `data` y `meta`.

**Dado** el slug de un borrador,
**cuando** lo pido,
**entonces** recibo 404.

**Dado** muchas peticiones seguidas,
**cuando** supero el límite,
**entonces** recibo 429.

## Definición de Hecho

- Rutas públicas bajo `/api/v1` con controladores y `Resource`.
- `scopePublished` en entradas y páginas.
- Límite de peticiones (`throttleApi` + limitador `api`).
- Contrato documentado en [`03-api.md`](../03-api.md).

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `PublicContentTest` (9 pruebas) | listados, filtros, detalle, borradores y sitemap ✅ |
| `GET /api/v1/site` en producción | JSON con ajustes y menú ✅ |
