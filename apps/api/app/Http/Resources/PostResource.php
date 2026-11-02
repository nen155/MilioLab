<?php

namespace App\Http\Resources;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Post */
class PostResource extends JsonResource
{
    /**
     * Representación completa para el panel (incluye el cuerpo del artículo).
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
            'body' => $this->body,
            'body_en' => $this->body_en,
            'status' => $this->status,
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
            'meta_title' => $this->meta_title,
            'meta_title_en' => $this->meta_title_en,
            'meta_description' => $this->meta_description,
            'meta_description_en' => $this->meta_description_en,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
