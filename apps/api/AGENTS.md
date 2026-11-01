# Convenciones — API MilioLab (Laravel 13)

## Estructura

```
app/Http/Controllers/Api/          API pública (SiteController, Public*Controller)
app/Http/Controllers/Api/Admin/    API del panel (CRUD)
app/Http/Requests/                 Validación (FormRequest)
app/Http/Resources/                Serialización JSON
app/Models/                        Eloquent + Concerns/HasSlug
app/Services/HtmlSanitizer.php     Limpieza del HTML del editor
routes/api.php                     /api/v1 (público) y /api/v1/admin (token)
routes/web.php                     sitemap, feed y health
```

## Reglas

- **Rutas**: las públicas van en `/api/v1`, las del panel en `/api/v1/admin`.
  No dupliques URIs entre grupos (Laravel se queda con una y la otra deja de existir).
- **Validación** siempre en `FormRequest`; nunca validar en el controlador.
- **Respuestas** con `Resource` (envuelven en `data`). Los listados paginados
  incluyen `data` y `meta`.
- **HTML del editor**: pasa siempre por `HtmlSanitizer` antes de guardar.
- **Slugs**: `HasSlug` los genera del `title` (o `name` en taxonomías) y evita
  duplicados con `-2`, `-3`… No añadas reglas `unique` de slug en la validación.
- **Autorización**: `auth:sanctum` en el panel; `role:admin` para ajustes.
- **Tests**: PHPUnit con `RefreshDatabase`. La base de datos de test es
  `miliolab_test` (`.env.testing` + `phpunit.xml`). Nunca ejecutes los tests
  contra la base de datos de desarrollo.

## Comandos

```bash
docker compose exec api php artisan test
docker compose exec api php artisan migrate:fresh --seed
docker compose exec api ./vendor/bin/pint      # estilo (Laravel Pint)
```

## Al añadir una tabla o campo

1. Migración nueva (no edites las ya aplicadas).
2. Modelo con `#[Fillable]` y relaciones.
3. `FormRequest` con las reglas.
4. `Resource` con el campo.
5. Test de feature que lo cubra.
