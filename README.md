# MilioLab — CMS propio (Angular + Angular + Laravel)

CMS propio para **miliolab.com**: web pública, panel de administración y API, con el
mismo stack que usa el resto de proyectos del estudio pero separado en tres aplicaciones.

| App | Carpeta | Tecnología | URL en producción |
|---|---|---|---|
| Web pública | `apps/web` | Angular 22 (standalone, zoneless) | `https://miliolab.com/` |
| Panel de administración | `apps/panel` | Angular 22 (standalone, zoneless) | `https://miliolab.com/milio/` |
| API | `apps/api` | Laravel 13 + Sanctum | `https://miliolab.com/api/` |

Base de datos de producción: MariaDB 11.8 en IONOS (`db5021798117.hosting-data.io:3306`,
base `dbs16295460`). Las credenciales **no** viven en el repositorio.

## Puesta en marcha (desarrollo)

Requisitos: Docker Desktop y Node 22+.

```bash
# 1) API + base de datos (MariaDB 11.8)
cp .env.example .env
docker compose up -d --build
docker compose exec api php artisan migrate --seed

# 2) Web pública (http://localhost:4200)
cd apps/web && npm start

# 3) Panel (http://localhost:4201/milio/)
cd apps/panel && npm start
```

El panel arranca en el puerto 4201 y hace proxy de `/api` al contenedor de la API
(`http://localhost:8000`), igual que en producción.

Credenciales de ejemplo del seeder (cámbialas en producción):

- Usuario: `admin@miliolab.com`
- Contraseña: `miliolab`

## Estructura

```
apps/
  api/      Laravel 13 (API REST + autenticación con tokens Sanctum)
  web/      Angular 22 (web pública: páginas, blog, categorías, buscador)
  panel/    Angular 22 (panel: entradas, páginas, medios, menús y ajustes)
deploy/     Scripts de despliegue al hosting compartido (IONOS)
docs/       Arquitectura, modelo de datos, API y guía de despliegue
```

## Documentación

- [`docs/01-arquitectura.md`](docs/01-arquitectura.md)
- [`docs/02-modelo-datos.md`](docs/02-modelo-datos.md)
- [`docs/03-api.md`](docs/03-api.md)
- [`docs/04-despliegue.md`](docs/04-despliegue.md)

## Comandos útiles

```bash
docker compose logs -f api          # registro de la API
docker compose exec api php artisan migrate:fresh --seed   # reiniciar datos de ejemplo
docker compose exec api php artisan test                    # tests del backend
cd apps/web && npm run build        # build de producción de la web
cd apps/panel && npm run build:prod # build del panel con base href /milio/
```

## Despliegue en miliolab.com

Todo el proceso está en [`docs/04-despliegue.md`](docs/04-despliegue.md). En resumen:

```bash
cp deploy/deploy.env.example deploy/deploy.env   # credenciales SFTP + BD (no se versiona)
powershell -ExecutionPolicy Bypass -File deploy/deploy-hosting.ps1 -Build -Env -Seed
```

Estructura en el hosting: web en `/htdocs/miliolab`, panel en
`/htdocs/miliolab/milio`, API pública en `/htdocs/miliolab/api` y aplicación
Laravel en `/htdocs/miliolab-api` (fuera del docroot).
