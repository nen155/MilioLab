# Despliegue — MilioLab (IONOS)

Hosting compartido de IONOS, mismo webspace que `landing-cinema-decisive`.
Dominio: **miliolab.com**. Base de datos: **MariaDB 11.8** en
`db5021798117.hosting-data.io:3306`, base `dbs16295460`, usuario `dbu1543693`.

## 1. Estructura remota

```
/miliolab/            → web pública (build de apps/web + .htaccess)
/miliolab/milio/      → panel (build de apps/panel + .htaccess)
/miliolab/api/        → public/ de Laravel (index.php, .htaccess, media/)
/miliolab/app/        → aplicación Laravel completa (bloqueada por .htaccess)
```

`/miliolab` es el **docroot de miliolab.com** (comprobado en el webspace). La raíz
del hosting es de solo lectura, así que la aplicación Laravel vive dentro del
docroot en `app/`, protegida por `deploy/api-app/.htaccess` y por una regla `[F]`
en el `.htaccess` de la web. Si el dominio apuntara a otra carpeta, cambia
`DEPLOY_WEB_DIR` en `deploy/deploy.env`.

## 2. Preparar la base de datos

1. En el panel de IONOS, abre **Bases de datos → dbs16295460**.
2. Comprueba que el usuario `dbu1543693` tiene permisos sobre ella.
3. No hace falta crear tablas: las crea `php artisan migrate` en el despliegue.

## 3. Configurar el despliegue

```bash
cp deploy/deploy.env.example deploy/deploy.env
```

Rellena:

- `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PASSWORD`: los mismos datos SFTP del
  hosting (panel de IONOS → *SFTP & SSH*).
- `DEPLOY_TOKEN`: cadena aleatoria larga (protege los scripts de despliegue).
- Rutas y URLs si tu estructura difiere.

`deploy/deploy.env` está en `.gitignore`: **no se sube al repositorio**.

## 4. Primer despliegue

```bash
powershell -ExecutionPolicy Bypass -File deploy/deploy-hosting.ps1 -Build -Seed
```

El script:

1. Compila la web y el panel (`npm run build` / `npm run build:prod`).
2. Empaqueta la API con `vendor/` en `deploy/out/api.zip`.
3. Sube el zip, lo extrae con `unzip-deploy.php` y ejecuta `deploy.php`
   (migraciones, cachés y permisos).
4. Publica `index.php` y `.htaccess` de la API y crea `api/media`.
5. Sincroniza la web y el panel.

## 5. Configurar la API en el servidor

La forma recomendada es dejar que el script genere el `.env`:

1. Rellena en `deploy/deploy.env`:

   ```dotenv
   DEPLOY_SITE_URL=https://miliolab.com
   DEPLOY_DB_PASSWORD=…        # contraseña de dbu1543693
   DEPLOY_ADMIN_EMAIL=tu-correo@ejemplo.com
   DEPLOY_ADMIN_PASSWORD=…     # contraseña inicial del panel
   ```

2. Despliega con el paso de entorno:

   ```bash
   powershell -ExecutionPolicy Bypass -File deploy/deploy-hosting.ps1 -Build -Env -Seed
   ```

`-Env` sube `deploy/out/api.env` generado desde `deploy/api.env.template` a
`/miliolab/app/.env`. `-Seed` crea el usuario administrador y el contenido
de ejemplo. `deploy.php` genera la `APP_KEY` automáticamente si está vacía.

> Alternativa manual: crea `/miliolab/app/.env` por SFTP copiando
> `apps/api/.env.example`, y ejecuta una vez
> `https://miliolab.com/api/deploy.php?token=…&key=1` para generar la clave.

### Variables imprescindibles en producción

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://miliolab.com
DB_HOST=db5021798117.hosting-data.io
DB_DATABASE=dbs16295460
DB_USERNAME=dbu1543693
MEDIA_ROOT=/miliolab/api/media
MEDIA_URL=https://miliolab.com/media
```

## 6. Comprobar

| URL | Qué debe pasar |
|---|---|
| `https://miliolab.com/` | Portada con las entradas de ejemplo |
| `https://miliolab.com/milio/` | Login del panel (admin@…) |
| `https://miliolab.com/api/up` | `200` con el health check |
| `https://miliolab.com/api/v1/site` | JSON con ajustes y menú |
| `https://miliolab.com/sitemap.xml` | XML con páginas y entradas |
| `https://miliolab.com/feed.xml` | RSS |

## 7. Publicar contenido nuevo (sin desplegar)

Desde el panel: **Entradas → Nueva entrada → Publicar**. No hay que compilar ni
subir nada: la web lee de la API en cada visita.

## 8. Actualizar el código

```bash
powershell -ExecutionPolicy Bypass -File deploy/deploy-hosting.ps1 -Build
```

No uses `-Seed` salvo que quieras volver a crear los datos de ejemplo (los seeders
son idempotentes, pero sobrescriben los ajustes con los valores por defecto).

## 9. Copias de seguridad

- **Base de datos**: exporta desde phpMyAdmin o `mysqldump` (ver
  [`02-modelo-datos.md`](02-modelo-datos.md)).
- **Medios**: descarga `/miliolab/api/media` por SFTP.
- **Código**: está en GitHub (`nen155/MilioLab`).

## 10. Problemas habituales

| Síntoma | Causa / solución |
|---|---|
| 500 en la API | Revisa `storage/logs/laravel.log` y que `storage/` y `bootstrap/cache/` sean escribibles (775). |
| 404 en `/api/v1/...` | Falta `index.php` en `/miliolab/api` o el `.htaccess` de Laravel. |
| Las imágenes suben pero no se ven | `MEDIA_ROOT` no apunta a `/miliolab/api/media` o faltan permisos. |
| «No se pudo conectar con la API» | `APP_URL`, CORS o la API caída; revisa `/api/up`. |
| El panel entra pero todo da 401 | Token caducado: cierra sesión y vuelve a entrar. |
| `sitemap.xml` devuelve el HTML de la web | Falta la regla de reescritura del `.htaccess` de la web. |

## 11. Notas de seguridad

- `APP_DEBUG=false` en producción (si no, se filtran rutas y variables).
- Cambia `ADMIN_PASSWORD` tras el primer acceso.
- Borra `deploy.php` y `unzip-deploy.php` del servidor tras cada despliegue (el
  script lo hace automáticamente; verifica que no queden).
- El panel está en `/milio/` con `X-Robots-Tag: noindex`; no lo enlaces desde la web.
