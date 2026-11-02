<?php

namespace App\Http\Resources;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Post */
class PostSummaryResource extends JsonResource
{
    /**
     * Resumen para listados (sin el cuerpo, que pesa y no se pinta en las tarjetas).
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'title_en' => $this->title_en,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'excerpt_en' => $this->excerpt_en,
            'published_at' => $this->published_at?->toIso8601String(),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'cover' => new MediaResource($this->whenLoaded('cover')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'author' => $this->whenLoaded('author', fn () => [
                'id' => $this->author->id,
                'name' => $this->author->name,
            ]),
            'reading_minutes' => $this->readingMinutes(),
            'reading_minutes_en' => $this->readingMinutes($this->body_en),
        ];
    }
}
