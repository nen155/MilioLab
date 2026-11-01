# Arquitectura — MilioLab

CMS propio con tres aplicaciones independientes que comparten una única API.

```
                    ┌──────────────────────────────┐
   miliolab.com     │  apps/web  (Angular 22)      │  web pública
                    └──────────────┬───────────────┘
                                   │  /api/v1  (lectura, sin autenticación)
                    ┌──────────────▼───────────────┐
                    │  apps/api  (Laravel 13)      │  API REST + MariaDB 11.8
                    └──────────────▲───────────────┘
                                   │  /api/v1/admin + /api/v1/auth (token Sanctum)
                    ┌──────────────┴───────────────┐
   miliolab.com/milio│  apps/panel (Angular 22)    │  panel de administración
                    └──────────────────────────────┘
```

## Por qué así

| Decisión | Motivo |
|---|---|
| **SPA (sin SSR)** | El hosting es compartido: no hay proceso Node permanente. Se compila a estáticos y se sirve con Apache. Contrapartida: el HTML inicial está vacío; los metadatos sociales se generan con `Meta`/`Title` en el navegador (Google ejecuta JS, pero algunos *bots* de redes sociales no). |
| **Dos Angular separados** | La web pública no carga el editor ni el código del panel: 78 KB de transferencia frente a ~110 KB del panel con TipTap. Además se pueden desplegar por separado. |
| **Tokens Sanctum (Bearer)** | Sin cookies ni CSRF entre subcarpetas: el panel guarda el token en `localStorage` y lo manda en cada petición. Revocar sesión = borrar el token. |
| **HTML limpiado en el servidor** | El editor guarda HTML; se pasa por HTMLPurifier (`mews/purifier`) al guardar. La web puede pintarlo con `bypassSecurityTrustHtml` sin riesgo de XSS. |
| **API fuera del docroot** | La app Laravel completa vive fuera de `htdocs`; solo su `public/` está expuesto. `.env`, `vendor/` y `storage/` no son accesibles por HTTP. |
| **Medios en `public/media`** | Se sirven directamente, sin `storage:link` (que en hosting compartido suele fallar). En producción `MEDIA_ROOT` apunta a la carpeta pública real. |
| **Rutas admin bajo `/api/v1/admin`** | Evita colisiones con las rutas públicas (`GET /posts` existe en ambos mundos). |

## Flujo de una petición

1. El navegador pide `https://miliolab.com/blog/mi-entrada`.
2. Apache no encuentra el archivo y devuelve `index.html` (regla del `.htaccess`).
3. Angular arranca, resuelve la ruta y pide `GET /api/v1/posts/mi-entrada`.
4. Laravel devuelve el JSON; Angular pinta el contenido y actualiza `<title>` y metadatos.

## Flujo de publicación

1. El editor entra en `/milio/login`; la API devuelve un token de Sanctum.
2. Escribe en TipTap y guarda: `POST /api/v1/admin/posts` con `Authorization: Bearer …`.
3. Laravel valida, limpia el HTML, genera el slug único y guarda.
4. La web pública lo ve al recargar (no hay caché de contenido en el cliente más allá de la sesión).

## Estructura del repositorio

```
apps/api/       Laravel 13 · modelos, controladores, migraciones, seeders y tests
apps/web/       Angular 22 · portada, páginas, blog, categorías y buscador
apps/panel/     Angular 22 · login, CRUD de contenido, multimedia, menú y ajustes
deploy/         Build + despliegue al hosting (WinSCP) y scripts remotos
docs/           Esta documentación
docker-compose.yml   MariaDB 11.8 + API para desarrollo
```

## Versiones

- Angular **22.2** (standalone, zoneless, signals, Vitest).
- Laravel **13.39** (PHP 8.4 en Docker, 8.3+ mínimo).
- MariaDB **11.8** (producción y desarrollo).
- TipTap **3.32** (editor).
