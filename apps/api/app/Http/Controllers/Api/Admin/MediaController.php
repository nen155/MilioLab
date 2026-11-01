<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MediaRequest;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $media = Media::query()
            ->when($request->filled('q'), fn ($query) => $query->where('filename', 'like', '%'.$request->string('q').'%'))
            ->when($request->filled('type'), function ($query) use ($request): void {
                $type = (string) $request->string('type');
                $query->where('mime_type', 'like', $type.'/%');
            })
            ->orderByDesc('id')
            ->paginate(min(max($request->integer('per_page', 24), 1), 100));

        return MediaResource::collection($media);
    }

    public function store(MediaRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $folder = now()->format('Y/m');
        $name = Str::uuid()->toString().'.'.strtolower($file->getClientOriginalExtension());

        $path = $file->storeAs($folder, $name, 'media');

        [$width, $height] = $this->dimensions($file->getRealPath(), (string) $file->getMimeType());

        $media = Media::query()->create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'disk' => 'media',
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'width' => $width,
            'height' => $height,
            'alt' => $request->input('alt'),
            'title' => $request->input('title'),
            'uploaded_by' => $request->user()->id,
        ]);

        return (new MediaResource($media))->response()->setStatusCode(201);
    }

    public function destroy(Media $media): JsonResponse
    {
        Storage::disk($media->disk)->delete($media->path);
        $media->delete();

        return response()->json(['message' => 'Archivo eliminado.']);
    }

    /**
     * @return array{0: int|null, 1: int|null}
     */
    private function dimensions(string $path, string $mime): array
    {
        if (! str_starts_with($mime, 'image/') || $mime === 'image/svg+xml') {
            return [null, null];
        }

        $size = @getimagesize($path);

        return $size === false ? [null, null] : [(int) $size[0], (int) $size[1]];
    }
}
