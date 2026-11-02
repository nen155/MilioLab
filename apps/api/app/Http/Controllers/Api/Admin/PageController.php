<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PageRequest;
use App\Http\Resources\PageResource;
use App\Models\Page;
use App\Services\HtmlSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PageController extends Controller
{
    public function __construct(private readonly HtmlSanitizer $sanitizer) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $pages = Page::query()
            ->when($request->filled('q'), function ($query) use ($request): void {
                $term = '%'.$request->string('q').'%';
                $query->where(fn ($q) => $q->where('title', 'like', $term)->orWhere('slug', 'like', $term));
            })
            ->when($request->filled('status'), fn ($query) => $query->where('status', (string) $request->string('status')))
            ->orderBy('title')
            ->paginate(min(max($request->integer('per_page', 50), 1), 100));

        return PageResource::collection($pages);
    }

    public function store(PageRequest $request): JsonResponse
    {
        $page = new Page($this->payload($request));
        $page->author_id = $request->user()->id;
        $page->save();

        return (new PageResource($page))->response()->setStatusCode(201);
    }

    public function show(Page $page): PageResource
    {
        return new PageResource($page);
    }

    public function update(PageRequest $request, Page $page): PageResource
    {
        $page->fill($this->payload($request))->save();

        return new PageResource($page);
    }

    public function destroy(Page $page): JsonResponse
    {
        $page->delete();

        return response()->json(['message' => 'Página eliminada.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(PageRequest $request): array
    {
        $data = $request->validated();

        $data['body'] = $this->sanitizer->clean($data['body'] ?? null);
        $data['body_en'] = $this->sanitizer->clean($data['body_en'] ?? null);
        $data['status'] ??= Page::STATUS_DRAFT;
        $data['template'] ??= 'default';

        if ($data['status'] === Page::STATUS_PUBLISHED && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        return $data;
    }
}
