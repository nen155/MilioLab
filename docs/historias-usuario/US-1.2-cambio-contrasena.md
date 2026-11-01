# US-1.2 — Cambio de contraseña y revocación de sesiones

| | |
|---|---|
| **Épica** | EP-1 — Acceso y cuentas |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-1.3](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **cambiar mi contraseña desde el panel** para
**mantener mi cuenta segura sin tocar la base de datos**.

## Criterios de aceptación

**Dado** un usuario autenticado,
**cuando** indica su contraseña actual y una nueva dos veces,
**entonces** la contraseña se actualiza y las demás sesiones quedan cerradas.

**Dado** una contraseña actual incorrecta,
**cuando** intenta cambiarla,
**entonces** la API responde 422 con el error en `current_password`.

**Dado** una contraseña nueva de menos de 8 caracteres o sin confirmar,
**cuando** guarda,
**entonces** la API rechaza el cambio.

## Definición de Hecho

- `PUT /api/v1/admin/profile/password` con validación y `Hash::check`.
- Se conserva el token actual y se borran los demás.
- Pantalla «Mi cuenta» en el panel con el formulario y mensajes.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `ProfileTest` (4 pruebas) | cambio, contraseña actual errónea, validación y revocación ✅ |
| Formulario en el panel | guarda y muestra confirmación ✅ |
