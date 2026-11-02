<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Theme;

class PublicThemeController extends Controller
{
    /**
     * Catálogo público de temas para el selector «prueba mis diseños».
     *
     * @return array<string, mixed>
     */
    public function __invoke(): array
    {
        return [
            'data' => Theme::query()->orderBy('name')->get()->map(fn (Theme $theme) => [
                'id' => $theme->id,
                'name' => $theme->name,
                'slug' => $theme->slug,
                'layout' => $theme->layout,
                'layout_label' => Theme::LAYOUT_LABELS[$theme->layout] ?? $theme->layout,
                'tokens' => $theme->tokens,
                'config' => $theme->config,
            ])->all(),
        ];
    }
}
