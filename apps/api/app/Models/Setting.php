<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'value', 'type', 'group'])]
class Setting extends Model
{
    public const TYPE_STRING = 'string';

    public const TYPE_TEXT = 'text';

    public const TYPE_BOOL = 'bool';

    public const TYPE_INT = 'int';

    public const TYPE_JSON = 'json';

    protected function casts(): array
    {
        return [
            'value' => 'string',
        ];
    }

    /**
     * Valor ya convertido al tipo declarado.
     */
    public function typedValue(): mixed
    {
        return match ($this->type) {
            self::TYPE_BOOL => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            self::TYPE_INT => (int) $this->value,
            self::TYPE_JSON => json_decode((string) $this->value, true) ?? [],
            default => $this->value,
        };
    }

    /**
     * Todos los ajustes como array clave → valor convertido.
     *
     * @return array<string, mixed>
     */
    public static function toArrayOfValues(): array
    {
        return static::query()
            ->orderBy('key')
            ->get()
            ->mapWithKeys(fn (self $setting) => [$setting->key => $setting->typedValue()])
            ->all();
    }

    public static function value(string $key, mixed $default = null): mixed
    {
        $setting = static::query()->where('key', $key)->first();

        return $setting?->typedValue() ?? $default;
    }
}
