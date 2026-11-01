<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:120'],
            'url' => ['nullable', 'string', 'max:255'],
            'page_id' => ['nullable', 'integer', 'exists:pages,id'],
            'parent_id' => [
                'nullable',
                'integer',
                'exists:menu_items,id',
                Rule::notIn([$this->route('menu_item')?->id]),
            ],
            'position' => ['nullable', 'integer', 'min:0'],
            'target' => ['nullable', Rule::in(['_self', '_blank'])],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
