<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'slug', 'tokens', 'is_active'])]
class Theme extends Model
{
    use HasSlug;

    /**
     * Variables CSS que puede definir un tema. Cualquier otra clave se descarta
     * al guardar: así un tema importado no puede inyectar CSS arbitrario.
     */
    public const ALLOWED_TOKENS = [
        '--paper', '--paper-2', '--ink', '--ink-soft', '--ink-mute',
        '--line', '--line-strong', '--accent', '--accent-ink', '--accent-soft',
        '--grid', '--grid-size', '--measure', '--rail', '--radius',
        '--font-serif', '--font-sans', '--font-mono',
    ];

    protected function casts(): array
    {
        return [
            'tokens' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @param  array<string, mixed>  $tokens
     * @return array<string, string>
     */
    public static function sanitizeTokens(array $tokens): array
    {
        $clean = [];

        foreach ($tokens as $key => $value) {
            if (! in_array($key, self::ALLOWED_TOKENS, true) || ! is_scalar($value)) {
                continue;
            }

            $value = trim((string) $value);

            // Sin llaves, puntos y coma ni saltos: no se puede cerrar la regla CSS.
            if ($value === '' || preg_match('/[{};<>]/', $value)) {
                continue;
            }

            $clean[$key] = $value;
        }

        return $clean;
    }

    public function activate(): void
    {
        static::query()->whereKeyNot($this->getKey())->update(['is_active' => false]);
        $this->forceFill(['is_active' => true])->save();
    }

    public static function active(): ?self
    {
        return static::query()->where('is_active', true)->first();
    }
}
