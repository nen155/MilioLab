# US-0.2 — Despliegue en hosting compartido (IONOS)

| | |
|---|---|
| **Épica** | EP-0 — Plataforma |
| **Rol** | Desarrolladora/or |
| **Requisitos** | [RNF-1](../06-requisitos.md), [RNF-5](../06-requisitos.md), [RNF-6](../06-requisitos.md) |

## Descripción

Como **responsable del sitio** quiero **publicar el CMS en el hosting compartido sin
SSH** para **tener miliolab.com en producción con el mínimo mantenimiento**.

## Criterios de aceptación

**Dado** el webspace de IONOS con PHP 8.4,
**cuando** se ejecuta `deploy/deploy-hosting.ps1 -Build -Env -Seed`,
**entonces** quedan publicados la web, el panel, la API y la aplicación Laravel, con
la base de datos migrada y el usuario administrador creado.

**Dado** el despliegue terminado,
**cuando** se visita `https://miliolab.com/api/up`,
**entonces** responde 200 y la web y el panel cargan desde sus rutas.

**Dado** un archivo de la aplicación Laravel (`.env`, `vendor/`),
**cuando** se intenta abrir por HTTP,
**entonces** la petición se deniega.

## Definición de Hecho

- `deploy/build.ps1`: compila la web, el panel y empaqueta la API con `vendor/`.
- `deploy/deploy-hosting.ps1`: sube por SFTP (WinSCP), extrae, migra y publica.
- `deploy/remote/*.php`: extracción y comandos de Artisan sin CLI.
- `.htaccess` de web (SPA + rutas de API), panel (`/milio`) y bloqueo de `/app`.
- `deploy/deploy.env.example` documentado; `deploy.env` en `.gitignore`.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `https://miliolab.com/` | 200 con la web Angular ✅ |
| `https://miliolab.com/milio/` | 200 con el panel ✅ |
| Extracción del zip en el servidor | 9.462 archivos, `vendor: OK`, `.env: OK` ✅ |
| `key:generate`, `config:cache`, `route:cache` | correctos ✅ |
| Migraciones y seed | pendiente de la contraseña de la base de datos en `deploy.env` ⏳ |
