# US-4.1 — Biblioteca de medios

| | |
|---|---|
| **Épica** | EP-4 — Multimedia |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-4.1](../06-requisitos.md), [RF-4.2](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **subir imágenes y PDF y reutilizarlos** para
**no repetir archivos ni depender de servicios externos**.

## Criterios de aceptación

**Dado** el panel en «Multimedia»,
**cuando** arrastro o elijo un archivo permitido,
**entonces** se sube, aparece en la rejilla y se puede copiar su URL.

**Dado** un archivo de más de 10 MB o un formato no permitido,
**cuando** lo intento subir,
**entonces** la API responde 422 con un mensaje claro.

**Dado** un archivo de la biblioteca,
**cuando** lo borro y confirmo,
**entonces** desaparece el registro y el fichero del disco.

## Definición de Hecho

- `POST /api/v1/admin/media` (multipart), `GET`, `DELETE`.
- Disco `media` sobre `public/media` (o `MEDIA_ROOT` en producción).
- Validación de MIME y tamaño; dimensiones para imágenes.
- Rejilla con arrastrar y soltar, copiar URL y borrar.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `MediaTest` (subida, rechazo, listado y borrado) | ✅ |
| Subida real en local | `GET /media/...` responde `image/png` ✅ |
