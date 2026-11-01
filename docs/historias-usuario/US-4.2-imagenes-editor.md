# US-4.2 — Imágenes en el editor

| | |
|---|---|
| **Épica** | EP-4 — Multimedia |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-4.3](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **insertar imágenes de la biblioteca dentro del
texto** para **ilustrar las entradas sin salir del editor**.

## Criterios de aceptación

**Dado** el editor de una entrada o página,
**cuando** pulso «Imagen» y elijo una de la biblioteca,
**entonces** se inserta en la posición del cursor con su texto alternativo.

**Dado** el selector de imágenes,
**cuando** no hay archivos,
**entonces** permite subir uno desde el propio selector.

**Dado** una imagen insertada,
**cuando** se publica,
**entonces** el HTML guardado conserva `src` y `alt` y la web la muestra.

## Definición de Hecho

- Extensión `Image` de TipTap (sin base64).
- `MediaPickerComponent` reutilizable (subida + selección).
- El editor expone `insertImage(url, alt)` para insertar en el cursor.
- HTMLPurifier permite `img` con `src`, `alt`, `width`, `height` y `loading`.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Inserción desde el panel | imagen visible en el contenido ✅ |
| Limpieza del HTML | `<img>` conservada; `<script>` eliminado ✅ |
