<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Media;
use App\Models\Page;
use App\Models\Post;
use App\Models\Tag;

class StatsController extends Controller
{
    /**
     * Resumen para el escritorio del panel.
     *
     * @return array<string, mixed>
     */
    public function __invoke(): array
    {
        return [
            'posts' => [
                'total' => Post::query()->count(),
                'published' => Post::query()->where('status', Post::STATUS_PUBLISHED)->count(),
                'drafts' => Post::query()->where('status', Post::STATUS_DRAFT)->count(),
            ],
            'pages' => [
                'total' => Page::query()->count(),
                'published' => Page::query()->where('status', Page::STATUS_PUBLISHED)->count(),
            ],
            'media' => Media::query()->count(),
            'categories' => Category::query()->count(),
            'tags' => Tag::query()->count(),
            'recent_posts' => Post::query()
                ->with('category')
                ->orderByDesc('updated_at')
                ->limit(5)
                ->get()
                ->map(fn (Post $post) => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'status' => $post->status,
                    'category' => $post->category?->name,
                    'updated_at' => $post->updated_at?->toIso8601String(),
                ]),
        ];
    }
}
