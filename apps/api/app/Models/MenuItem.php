<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['label', 'label_en', 'url', 'page_id', 'parent_id', 'position', 'target', 'is_active'])]
class MenuItem extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('position');
    }

    /**
     * URL final: la de la página enlazada o la escrita a mano.
     */
    public function resolvedUrl(): string
    {
        if ($this->page !== null) {
            return '/'.$this->page->slug;
        }

        return (string) ($this->url ?: '/');
    }
}
