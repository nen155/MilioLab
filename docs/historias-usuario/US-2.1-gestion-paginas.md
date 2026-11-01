# US-2.1 — Gestión de páginas

| | |
|---|---|
| **Épica** | EP-2 — Páginas |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-2.1](../06-requisitos.md), [RF-2.2](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **crear y editar páginas con un editor visual**
para **mantener las secciones fijas del sitio (inicio, sobre mí, contacto…)**.

## Criterios de aceptación

**Dado** el panel en «Páginas»,
**cuando** creo una página con título y contenido,
**entonces** aparece en el listado y se puede abrir en `/<slug>`.

**Dado** un título «Sobre mí»,
**cuando** guardo sin escribir la URL,
**entonces** el slug es `sobre-mi`; si ya existe, `sobre-mi-2`.

**Dado** una página existente,
**cuando** pulso «Borrar» y confirmo,
**entonces** desaparece del panel y de la web.

## Definición de Hecho

- `apiResource pages` en `/api/v1/admin` con `PageRequest` y `PageResource`.
- `HasSlug` genera slugs únicos (incluye registros de otros estados).
- Editor TipTap con barra de formato (títulos, listas, citas, código, enlaces, imágenes).
- Listado con búsqueda y filtro por estado.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `AdminContentTest::pages_can_be_managed` | crear, leer y borrar ✅ |
| Página real desde el panel | se publica y se ve en la web ✅ |
