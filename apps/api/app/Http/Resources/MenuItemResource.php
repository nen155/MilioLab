<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\MenuItem */
class MenuItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'url' => $this->resolvedUrl(),
            'raw_url' => $this->url,
            'page_id' => $this->page_id,
            'parent_id' => $this->parent_id,
            'position' => $this->position,
            'target' => $this->target,
            'is_active' => $this->is_active,
            'children' => MenuItemResource::collection($this->whenLoaded('children')),
        ];
    }
}
