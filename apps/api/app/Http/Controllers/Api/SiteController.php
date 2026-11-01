<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Http\Resources\PostSummaryResource;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\Post;
use App\Models\Setting;
use App\Models\Theme;

class SiteController extends Controller
{
    /**
     * Configuración pública del sitio + menú + últimas entradas.
     *
     * La web lo pide una sola vez al arrancar y lo guarda en memoria.
     *
     * @return array<string, mixed>
     */
    public function __invoke(): array
    {
        $homeId = (int) Setting::value('home_page_id', 0);

        $theme = Theme::active();

        return [
            'settings' => Setting::toArrayOfValues(),
            'theme' => $theme === null ? null : [
                'name' => $theme->name,
                'layout' => $theme->layout,
                'tokens' => $theme->tokens,
            ],
            'home' => $homeId > 0 ? Page::query()->published()->whereKey($homeId)->value('slug') : null,
            'menu' => MenuItemResource::collection(
                MenuItem::query()
                    ->with(['page', 'children.page'])
                    ->whereNull('parent_id')
                    ->where('is_active', true)
                    ->orderBy('position')
                    ->get()
            )->resolve(),
            'latest_posts' => PostSummaryResource::collection(
                Post::query()
                    ->published()
                    ->with(['category', 'cover', 'author'])
                    ->orderByDesc('published_at')
                    ->limit(3)
                    ->get()
            )->resolve(),
        ];
    }
}
