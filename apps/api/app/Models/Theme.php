<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'slug', 'tokens', 'layout', 'config', 'is_active'])]
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

    /** Variantes de diseño disponibles. El contenido es el mismo; cambia la piel. */
    public const LAYOUTS = ['notebook', 'cards', 'sketch', 'hud', 'desktop', 'playmat'];

    /** Etiquetas que ve el panel para cada variante. */
    public const LAYOUT_LABELS = [
        'notebook' => 'Cuaderno · papel milimetrado',
        'sketch' => 'Roca · presas y cuerda',
        'cards' => 'Cartas · marco dorado',
        'hud' => 'Consola · interfaz táctica',
        'desktop' => 'Escritorio · CRT 95',
        'playmat' => 'Tapete · Magic',
    ];

    protected function casts(): array
    {
        return [
            'tokens' => 'array',
            'config' => 'array',
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

    /**
     * Configuración declarativa del tema (por ahora, los textos del raíl).
     * Se guarda como JSON y el frontend la pinta sin conocer el tema.
     *
     * @param  array<string, mixed>  $config
     * @return array<string, mixed>
     */
    public static function sanitizeConfig(array $config): array
    {
        $rail = $config['rail'] ?? null;

        if (! is_array($rail)) {
            return [];
        }

        $clean = [];

        foreach (['aria', 'subtitle', 'type', 'foot'] as $key) {
            if (! isset($rail[$key]) || ! is_scalar($rail[$key])) {
                continue;
            }

            $value = trim(strip_tags((string) $rail[$key]));

            if ($value !== '') {
                $clean[$key] = mb_substr($value, 0, 120);
            }
        }

        if (isset($rail['items']) && is_array($rail['items'])) {
            $items = [];

            foreach ($rail['items'] as $item) {
                if (! is_array($item) || ! isset($item['label'], $item['value'])) {
                    continue;
                }

                if (! is_scalar($item['label']) || ! is_scalar($item['value'])) {
                    continue;
                }

                $label = trim(strip_tags((string) $item['label']));
                $value = trim(strip_tags((string) $item['value']));

                if ($label === '' || $value === '') {
                    continue;
                }

                $items[] = [
                    'label' => mb_substr($label, 0, 40),
                    'value' => mb_substr($value, 0, 60),
                ];

                if (count($items) >= 8) {
                    break;
                }
            }

            if ($items !== []) {
                $clean['items'] = $items;
            }
        }

        return $clean === [] ? [] : ['rail' => $clean];
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
