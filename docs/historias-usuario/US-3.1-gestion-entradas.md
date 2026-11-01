# US-3.1 — Gestión de entradas

| | |
|---|---|
| **Épica** | EP-3 — Entradas |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-3.1](../06-requisitos.md), [RF-3.4](../06-requisitos.md), [RF-3.6](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **escribir entradas con un editor visual y
publicarlas cuando estén listas** para **mantener el blog al día**.

## Criterios de aceptación

**Dado** el panel en «Entradas»,
**cuando** creo una entrada con título, entradilla y contenido,
**entonces** se guarda con estado borrador o publicada según lo elegido.

**Dado** una entrada publicada,
**cuando** la abro en la web,
**entonces** se muestra en `/blog/<slug>` con su tiempo de lectura calculado.

**Dado** dos entradas con el mismo título,
**cuando** guardo la segunda,
**entonces** su slug añade `-2`.

**Dado** el listado del panel,
**cuando** busco por texto o filtro por estado,
**entonces** solo veo las que coinciden y puedo paginar.

## Definición de Hecho

- `apiResource posts` en `/api/v1/admin` con `PostRequest` y `PostResource`.
- `readingMinutes()` calcula 200 palabras por minuto.
- Listado con búsqueda, filtro y paginación; acciones de editar y borrar.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `AdminContentTest` (crear, actualizar, borrar, slugs) | ✅ |
| Entrada creada desde el panel | aparece en `/blog` al publicar ✅ |
