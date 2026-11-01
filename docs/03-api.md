# API — MilioLab

Base: `https://miliolab.com/api/v1` (en desarrollo: `http://localhost:8000/api/v1`).

Respuestas en JSON. Las colecciones y recursos vienen envueltos en `data`:

```json
{ "data": { "id": 1, "title": "…" } }
```

## Autenticación

El panel usa **tokens de Sanctum** (Bearer). No hay cookies ni CSRF.

```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "admin@miliolab.com", "password": "…" }
```

```json
{
  "token": "1|wBivNX0AcFYWoBPUYPR5FoyZRUt5uvZCZ3IVALpH3b2226c6",
  "user": { "id": 1, "name": "MilioLab", "email": "…", "role": "admin", "is_admin": true }
}
```

Después, en cada petición del panel:

```http
Authorization: Bearer 1|wBivNX0…
```

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Devuelve el token (límite: 10 intentos/minuto) |
| GET | `/auth/me` | Usuario del token |
| POST | `/auth/logout` | Revoca el token actual |

## API pública (la web)

Solo contenido publicado. Sin autenticación.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/site` | Ajustes, menú, página de inicio y últimas 3 entradas |
| GET | `/pages/{slug}` | Página publicada |
| GET | `/posts` | Entradas paginadas (`page`, `per_page`, `category`, `tag`, `q`) |
| GET | `/posts/{slug}` | Entrada publicada (incluye el HTML) |
| GET | `/categories` | Categorías con número de entradas publicadas |
| GET | `/tags` | Etiquetas con número de entradas publicadas |

Ejemplo:

```bash
curl "https://miliolab.com/api/v1/posts?category=noticias&per_page=9"
```

```json
{
  "data": [
    {
      "id": 1,
      "title": "Por qué he construido mi propio CMS",
      "slug": "por-que-mi-propio-cms",
      "excerpt": "WordPress funciona, pero…",
      "published_at": "2026-10-30T11:30:06+00:00",
      "category": { "id": 1, "name": "Noticias", "slug": "noticias" },
      "cover": null,
      "tags": [],
      "author": { "id": 1, "name": "MilioLab" },
      "reading_minutes": 1
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 9, "total": 3 }
}
```

## API del panel

Todas requieren `Authorization: Bearer …`. Base: `/api/v1/admin`.

| Recurso | Rutas |
|---|---|
| Entradas | `GET/POST /posts`, `GET/PUT/DELETE /posts/{id}` |
| Páginas | `GET/POST /pages`, `GET/PUT/DELETE /pages/{id}` |
| Categorías | `GET/POST /categories`, `PUT/DELETE /categories/{id}` |
| Etiquetas | `GET/POST /tags`, `PUT/DELETE /tags/{id}` |
| Menú | `GET/POST /menu-items`, `PUT/DELETE /menu-items/{id}`, `PUT /menu-items/order` |
| Multimedia | `GET /media`, `POST /media` (multipart `file`), `DELETE /media/{id}` |
| Ajustes | `GET /settings`, `PUT /settings` (solo `admin`) |
| Resumen | `GET /stats` |
| Cuenta | `PUT /profile/password` |

### Cambiar la contraseña

```http
PUT /api/v1/admin/profile/password
Authorization: Bearer …

{
  "current_password": "…",
  "password": "nueva-contraseña",
  "password_confirmation": "nueva-contraseña"
}
```

Mínimo 8 caracteres. Al cambiarla se **revocan los demás tokens** (las otras
sesiones del panel se cierran); la sesión actual sigue viva.

### Crear una entrada

```http
POST /api/v1/admin/posts
Authorization: Bearer …
Content-Type: application/json

{
  "title": "Mi entrada",
  "slug": "",
  "excerpt": "Resumen",
  "body": "<p>Contenido</p>",
  "status": "published",
  "published_at": null,
  "category_id": 1,
  "cover_media_id": null,
  "meta_title": null,
  "meta_description": null,
  "tags": [1, 3]
}
```

- `slug` vacío → se genera del título (`mi-entrada`); si existe, `mi-entrada-2`.
- `status: published` sin `published_at` → se usa la fecha actual.
- El `body` se limpia con HTMLPurifier (se permiten `iframe` de YouTube/Vimeo).

### Subir un archivo

```http
POST /api/v1/admin/media
Content-Type: multipart/form-data

file=@foto.jpg
alt=Descripción
```

Devuelve `{ "data": { "id": 7, "url": "https://miliolab.com/media/2026/11/uuid.jpg", … } }`.
Formatos: JPG, PNG, WebP, GIF, SVG y PDF (máx. 10 MB).

### Ajustes

```http
PUT /api/v1/admin/settings
Authorization: Bearer …

{
  "settings": [
    { "key": "site_name", "value": "MilioLab", "type": "string", "group": "general" },
    { "key": "posts_per_page", "value": 9, "type": "int", "group": "blog" }
  ]
}
```

### Errores

| Código | Significado |
|---|---|
| 401 | Falta el token o está revocado |
| 403 | El rol no permite la acción (p. ej. ajustes con rol `editor`) |
| 404 | Recurso inexistente o no publicado |
| 422 | Validación: `{ "message": "…", "errors": { "campo": ["…"] } }` |
| 429 | Demasiadas peticiones (límite de la API) |

## Extras servidos por la API

| Ruta | Descripción |
|---|---|
| `GET /api/sitemap` | `sitemap.xml` (Apache lo publica en `/sitemap.xml`) |
| `GET /api/feed` | RSS 2.0 (Apache lo publica en `/feed.xml`) |
| `GET /api/v1/site` | Comprobación rápida de que la API responde |
