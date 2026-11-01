<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostSummaryResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicPostController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $posts = Post::query()
            ->published()
            ->with(['category', 'cover', 'tags', 'author'])
            ->when($request->filled('category'), function ($query) use ($request): void {
                $query->whereHas('category', fn ($q) => $q->where('slug', (string) $request->string('category')));
            })
            ->when($request->filled('tag'), function ($query) use ($request): void {
                $query->whereHas('tags', fn ($q) => $q->where('slug', (string) $request->string('tag')));
            })
            ->when($request->filled('q'), function ($query) use ($request): void {
                $term = '%'.$request->string('q').'%';
                $query->where(fn ($q) => $q
                    ->where('title', 'like', $term)
                    ->orWhere('excerpt', 'like', $term)
                    ->orWhere('body', 'like', $term));
            })
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(min(max($request->integer('per_page', 9), 1), 50));

        return PostSummaryResource::collection($posts);
    }

    public function show(string $slug): PostResource
    {
        $post = Post::query()
            ->published()
            ->with(['category', 'cover', 'tags', 'author'])
            ->where('slug', $slug)
            ->firstOrFail();

        return new PostResource($post);
    }
}
