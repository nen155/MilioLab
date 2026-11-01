# US-5.2 — Ajustes del sitio

| | |
|---|---|
| **Épica** | EP-5 — Navegación y ajustes |
| **Rol** | Autora/or del contenido (admin) |
| **Requisitos** | [RF-5.2](../06-requisitos.md), [RF-5.3](../06-requisitos.md), [RF-5.4](../06-requisitos.md), [RF-1.4](../06-requisitos.md) |

## Descripción

Como **administradora/or del sitio** quiero **cambiar nombre, lema, página de inicio,
blog, color, contacto y redes** para **ajustar el sitio sin despliegues**.

## Criterios de aceptación

**Dado** el panel en «Ajustes»,
**cuando** cambio el nombre del sitio y guardo,
**entonces** la cabecera y el pie de la web lo muestran al recargar.

**Dado** que elijo otra página de inicio,
**cuando** abro la portada,
**entonces** se pinta el contenido de esa página.

**Dado** un usuario con rol `editor`,
**cuando** intenta guardar ajustes por API,
**entonces** recibe 403.

**Dado** un color de acento nuevo,
**cuando** recargo la web,
**entonces** los botones y enlaces usan ese color.

## Definición de Hecho

- Tabla `settings` clave/valor con tipo y grupo.
- `GET/PUT /api/v1/admin/settings` (PUT solo `admin`).
- Pantalla agrupada: identidad, blog, apariencia, contacto y redes.
- La web aplica el color de acento como variable CSS.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `SettingsTest` (permisos y guardado múltiple) | ✅ |
| Pantalla de ajustes con datos reales | carga y guarda ✅ |
