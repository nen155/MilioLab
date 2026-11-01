<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Services\HtmlSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    public function __construct(private readonly HtmlSanitizer $sanitizer) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $posts = Post::query()
            ->with(['category', 'cover', 'tags', 'author'])
            ->when($request->filled('q'), function ($query) use ($request): void {
                $term = '%'.$request->string('q').'%';
                $query->where(fn ($q) => $q->where('title', 'like', $term)->orWhere('excerpt', 'like', $term));
            })
            ->when($request->filled('status'), fn ($query) => $query->where('status', (string) $request->string('status')))
            ->when($request->filled('category'), fn ($query) => $query->where('category_id', $request->integer('category')))
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return PostResource::collection($posts);
    }

    public function store(PostRequest $request): JsonResponse
    {
        $post = new Post($this->payload($request));
        $post->author_id = $request->user()->id;
        $post->save();

        $this->syncTags($post, $request);

        return (new PostResource($post->load(['category', 'cover', 'tags', 'author'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Post $post): PostResource
    {
        return new PostResource($post->load(['category', 'cover', 'tags', 'author']));
    }

    public function update(PostRequest $request, Post $post): PostResource
    {
        $post->fill($this->payload($request))->save();
        $this->syncTags($post, $request);

        return new PostResource($post->load(['category', 'cover', 'tags', 'author']));
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json(['message' => 'Entrada eliminada.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(PostRequest $request): array
    {
        $data = $request->safe()->except('tags');

        $data['body'] = $this->sanitizer->clean($data['body'] ?? null);
        $data['status'] ??= Post::STATUS_DRAFT;

        if ($data['status'] === Post::STATUS_PUBLISHED && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        return $data;
    }

    private function syncTags(Post $post, PostRequest $request): void
    {
        if ($request->has('tags')) {
            $post->tags()->sync($request->input('tags', []));
        }
    }
}
