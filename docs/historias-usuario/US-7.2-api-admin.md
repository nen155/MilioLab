# US-7.2 — API de administración

| | |
|---|---|
| **Épica** | EP-7 — API y calidad |
| **Rol** | Desarrolladora/or |
| **Requisitos** | [RF-7.2](../06-requisitos.md), [RF-7.3](../06-requisitos.md), [RF-7.4](../06-requisitos.md) |

## Descripción

Como **desarrolladora/or** quiero **una API de administración validada y protegida** para
**que el panel pueda gestionar el contenido sin duplicar reglas**.

## Criterios de aceptación

**Dado** una petición sin token a `/api/v1/admin/*`,
**cuando** llega a la API,
**entonces** recibe 401.

**Dado** un cuerpo inválido (sin título, categoría inexistente…),
**cuando** guardo,
**entonces** recibo 422 con los errores por campo.

**Dado** un contenido con `<script>` o un iframe no permitido,
**cuando** se guarda,
**entonces** el HTML se limpia antes de persistirse.

**Dado** un usuario `editor`,
**cuando** intenta cambiar ajustes,
**entonces** recibe 403.

## Definición de Hecho

- Rutas bajo `/api/v1/admin` con `auth:sanctum` y alias `role`.
- `FormRequest` por recurso y `Resource` para las respuestas.
- `HtmlSanitizer` (HTMLPurifier) en entradas y páginas.
- Errores JSON homogéneos (`message` + `errors`).

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `AdminContentTest` (10 pruebas) | 401, 422, limpieza de HTML, CRUD ✅ |
| `SettingsTest` | 403 para `editor` ✅ |
