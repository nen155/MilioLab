<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

trait HasSlug
{
    /**
     * Rellena el `slug` a partir del título y lo hace único.
     *
     * Si el usuario escribe uno, se respeta (solo se normaliza); si ya existe se
     * añade `-2`, `-3`… Incluye los registros borrados con SoftDeletes para no
     * chocar con el índice único de la base de datos.
     */
    public static function bootHasSlug(): void
    {
        static::saving(function (self $model): void {
            $model->slug = static::uniqueSlug(
                (string) ($model->slug ?: $model->slugSource()),
                $model->getKey(),
            );
        });
    }

    /**
     * Texto del que sale el slug cuando no se ha escrito uno.
     *
     * Las entradas y páginas usan `title`; las categorías y etiquetas, `name`.
     */
    protected function slugSource(): string
    {
        return (string) ($this->title ?? $this->name ?? '');
    }

    public static function uniqueSlug(string $source, mixed $ignoreId = null): string
    {
        $base = Str::slug($source) ?: Str::random(8);
        $slug = $base;
        $suffix = 2;

        while (static::slugExists($slug, $ignoreId)) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }

    protected static function slugExists(string $slug, mixed $ignoreId): bool
    {
        $query = static::query();

        if (in_array(SoftDeletes::class, class_uses_recursive(static::class), true)) {
            $query->withTrashed();
        }

        $query->where('slug', $slug);

        if ($ignoreId !== null) {
            $query->whereKeyNot($ignoreId);
        }

        return $query->exists();
    }
}
