# US-1.1 — Acceso al panel con token

| | |
|---|---|
| **Épica** | EP-1 — Acceso y cuentas |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-1.1](../06-requisitos.md), [RF-1.2](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **entrar al panel con mi correo y contraseña**
para **gestionar el sitio desde cualquier navegador**.

## Criterios de aceptación

**Dado** un usuario con credenciales válidas,
**cuando** inicia sesión en `/milio/login`,
**entonces** recibe un token, entra al escritorio y todas las peticiones del panel
llevan `Authorization: Bearer`.

**Dado** credenciales incorrectas,
**cuando** intenta entrar,
**entonces** ve un mensaje de error y no se crea ningún token.

**Dado** una sesión abierta,
**cuando** pulsa «Cerrar sesión»,
**entonces** el token se revoca en la API y vuelve al login.

**Dado** un token revocado o caducado,
**cuando** el panel hace una petición,
**entonces** la API responde 401 y el panel cierra la sesión.

## Definición de Hecho

- `POST /api/v1/auth/login` (límite 10/min), `GET /auth/me`, `POST /auth/logout`.
- Sanctum con tokens personales; `HasApiTokens` en `User`.
- Interceptor de Angular que añade el token y gestiona el 401.
- Guard de ruta y pantalla de login con validación.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `AuthTest` (5 pruebas) | login, error, me, logout ✅ |
| Login real en el panel | token en `localStorage` y redirección al escritorio ✅ |
