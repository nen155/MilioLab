<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TagRequest;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TagController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return TagResource::collection(
            Tag::query()->withCount('posts')->orderBy('name')->get()
        );
    }

    public function store(TagRequest $request): JsonResponse
    {
        $tag = Tag::query()->create($request->validated());

        return (new TagResource($tag->loadCount('posts')))->response()->setStatusCode(201);
    }

    public function update(TagRequest $request, Tag $tag): TagResource
    {
        $tag->update($request->validated());

        return new TagResource($tag->loadCount('posts'));
    }

    public function destroy(Tag $tag): JsonResponse
    {
        $tag->delete();

        return response()->json(['message' => 'Etiqueta eliminada.']);
    }
}
