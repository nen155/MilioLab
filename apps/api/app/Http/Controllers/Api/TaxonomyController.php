<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\TagResource;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TaxonomyController extends Controller
{
    public function categories(): AnonymousResourceCollection
    {
        return CategoryResource::collection(
            Category::query()
                ->withCount(['posts' => fn ($query) => $query->published()])
                ->orderBy('name')
                ->get()
        );
    }

    public function tags(): AnonymousResourceCollection
    {
        return TagResource::collection(
            Tag::query()
                ->withCount(['posts' => fn ($query) => $query->published()])
                ->orderBy('name')
                ->get()
        );
    }
}
