# US-3.3 — Portada y entradilla

| | |
|---|---|
| **Épica** | EP-3 — Entradas |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-3.3](../06-requisitos.md), [RF-4.4](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **elegir una imagen de portada y un resumen**
para **que las tarjetas del blog sean atractivas y legibles**.

## Criterios de aceptación

**Dado** el editor de una entrada,
**cuando** elijo una imagen de la biblioteca como portada,
**entonces** la tarjeta y la ficha de la entrada la muestran.

**Dado** una entrada sin portada,
**cuando** aparece en el listado,
**entonces** se pinta un marcador con la inicial del título (sin imágenes rotas).

**Dado** una entradilla escrita,
**cuando** se muestra la tarjeta,
**entonces** se usa ese texto como resumen.

## Definición de Hecho

- `cover_media_id` con `nullOnDelete` y `MediaResource` anidado.
- Selector de portada con el mismo explorador de medios del editor.
- Tarjetas con `aspect-ratio` fijo y `object-fit: cover`.
- Texto alternativo tomado de `alt` de la imagen.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Subida y asignación de portada desde el panel | se guarda y se muestra ✅ |
| Entrada sin portada | marcador de inicial ✅ |
