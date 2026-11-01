# US-0.1 — Entorno de desarrollo reproducible (Docker + MariaDB)

| | |
|---|---|
| **Épica** | EP-0 — Plataforma |
| **Rol** | Desarrolladora/or |
| **Requisitos** | [RNF-1](../06-requisitos.md) |

## Descripción

Como **desarrolladora/or** quiero **levantar la API y la base de datos con un solo
comando** para **trabajar en el CMS sin instalar PHP ni MySQL en el equipo**.

## Criterios de aceptación

**Dado** un equipo con Docker y Node 22,
**cuando** se ejecuta `docker compose up -d`,
**entonces** arrancan MariaDB 11.8 y la API en `http://localhost:8000`, se aplican
las migraciones y se siembran los datos de ejemplo.

**Dado** el contenedor de la API,
**cuando** se edita un archivo de `apps/api`,
**entonces** el cambio se refleja sin reconstruir la imagen (volumen montado).

**Dado** la base de datos de test,
**cuando** se ejecutan las pruebas,
**entonces** se usa `miliolab_test` y la base de desarrollo queda intacta.

## Definición de Hecho

- `docker-compose.yml` con `db` (MariaDB 11.8) y `api` (PHP 8.4 + Apache).
- `apps/api/Dockerfile` con `pdo_mysql`, `mbstring`, `gd`, `zip` y `mod_rewrite`.
- Migraciones y seeders idempotentes al arrancar.
- `.env.example` en la raíz y en `apps/api`.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `docker compose up -d` | contenedores `miliolab-db-1` y `miliolab-api-1` en marcha ✅ |
| `GET /api/v1/site` | JSON con ajustes, menú y entradas ✅ |
| `php artisan test` | 37 pruebas en verde ✅ |
