# Modelo de datos — MilioLab

MariaDB 11.8. Todas las tablas usan `utf8mb4` e InnoDB (por defecto en Laravel).

## `users`

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| name | varchar(255) | |
| email | varchar(255) | único |
| password | varchar(255) | hash bcrypt |
| role | varchar(20) | `admin` o `editor` (índice) |
| email_verified_at | timestamp | |
| remember_token | varchar(100) | |
| timestamps | | |

## `personal_access_tokens`

Tokens de Sanctum (`id`, `tokenable`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`).

## `categories` / `tags`

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| name | varchar(255) | |
| name_en | varchar(120) | nombre en inglés (opcional) |
| slug | varchar(255) | único, generado del nombre |
| description | text | solo categorías |
| description_en | text | descripción en inglés (solo categorías) |

## `posts`

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| title | varchar(255) | |
| title_en | varchar(255) | título en inglés (opcional) |
| slug | varchar(255) | único |
| excerpt | text | entradilla para las tarjetas |
| excerpt_en | text | entradilla en inglés |
| body | longtext | HTML limpio |
| body_en | longtext | HTML limpio en inglés |
| category_id | FK categories | `nullOnDelete` |
| cover_media_id | FK media | `nullOnDelete` |
| status | varchar(20) | `draft` / `published` (índice) |
| published_at | timestamp | índice; si falta al publicar se usa `now()` |
| author_id | FK users | `nullOnDelete` |
| meta_title | varchar(255) | SEO |
| meta_title_en | varchar(255) | SEO en inglés |
| meta_description | text | SEO |
| meta_description_en | text | SEO en inglés |
| timestamps | | |

Relación N:M con `tags` mediante `post_tag (post_id, tag_id)`.

## `pages`

Igual que `posts` sin categoría, etiquetas ni portada, más:

| Campo | Tipo | Notas |
|---|---|---|
| template | varchar(30) | `default`, `wide`, `landing` |

## `media`

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| filename | varchar(255) | nombre original |
| path | varchar(255) | ruta relativa en el disco `media` |
| disk | varchar(30) | `media` |
| mime_type | varchar(100) | |
| size | bigint | bytes |
| width / height | int | solo imágenes |
| alt / title | varchar(255) | accesibilidad |
| uploaded_by | FK users | `nullOnDelete` |

## `settings`

| Campo | Tipo | Notas |
|---|---|---|
| key | varchar(255) | única |
| value | longtext | serializado según `type` |
| type | varchar(20) | `string`, `text`, `bool`, `int`, `json` |
| group | varchar(40) | `general`, `blog`, `social`, `apariencia`, `contacto` |

Claves iniciales: `site_name`, `site_tagline`, `site_description`, `site_url`,
`home_page_id`, `footer_text`, `blog_title`, `blog_intro`, `posts_per_page`,
`show_author`, `accent_color`, `contact_email`, `social_*`.

Las claves con versión inglesa usan el sufijo `_en` (`site_tagline_en`,
`site_description_en`, `footer_text_en`, `blog_title_en`, `blog_intro_en`). La
web en inglés las usa si tienen valor y cae a la clave base si están vacías.

## Contenido bilingüe

Entradas, páginas, categorías, etiquetas y enlaces de menú guardan su versión
inglesa en columnas `*_en` del mismo registro. El `slug` es único y compartido:
la URL no cambia al cambiar de idioma. Todos los campos ingleses son opcionales;
la web aplica *fallback* al español cuando están vacíos.

## `menu_items`

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| label | varchar(255) | texto visible |
| label_en | varchar(255) | texto visible en inglés (opcional) |
| url | varchar(255) | enlace manual (alternativo a la página) |
| page_id | FK pages | `nullOnDelete` |
| parent_id | FK menu_items | soporte de submenús (`cascadeOnDelete`) |
| position | int | orden (índice) |
| target | varchar(10) | `_self` / `_blank` |
| is_active | boolean | |

La URL final se resuelve así: si hay `page_id`, `/<slug de la página>`; si no, `url`.

## Borrado

No hay *soft deletes*: borrar una entrada o página es definitivo (el panel pide
confirmación). Los ficheros de `media` se borran del disco al eliminar el registro.

## Copias de seguridad

```bash
# desde el panel de IONOS (phpMyAdmin) o por SSH:
mysqldump -h db5021798117.hosting-data.io -P 3306 -u dbu1543693 -p dbs16295460 > miliolab.sql
```
