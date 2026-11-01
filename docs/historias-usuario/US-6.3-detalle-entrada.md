# US-6.3 — Detalle de entrada

| | |
|---|---|
| **Épica** | EP-6 — Web pública |
| **Rol** | Visitante |
| **Requisitos** | [RF-6.5](../06-requisitos.md) |

## Descripción

Como **visitante** quiero **leer una entrada completa con su contexto** para **disfrutar
del contenido y saber cuándo y por quién se escribió**.

## Criterios de aceptación

**Dado** una entrada publicada,
**cuando** abro `/blog/<slug>`,
**entonces** veo título, entradilla, fecha, categoría, autor (si está activado), tiempo
de lectura, portada y contenido.

**Dado** una entrada con etiquetas,
**cuando** llego al final,
**entonces** aparecen como enlaces al listado filtrado.

**Dado** una entrada en borrador,
**cuando** alguien conoce la URL,
**entonces** recibe un 404.

## Definición de Hecho

- `GET /api/v1/posts/{slug}` solo devuelve publicadas.
- Componente de detalle con estado de carga y de error.
- Enlaces de vuelta al blog y a etiquetas.
- Ajuste `show_author` respetado.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `PublicContentTest::a_published_post_can_be_read_by_slug` | ✅ |
| Entrada real en la web | contenido, fecha, autor y etiquetas ✅ |
