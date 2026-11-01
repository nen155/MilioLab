<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MediaRequest extends FormRequest
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
            'file' => [
                'required',
                'file',
                'max:10240', // 10 MB
                'mimes:jpg,jpeg,png,webp,gif,svg,pdf',
            ],
            'alt' => ['nullable', 'string', 'max:190'],
            'title' => ['nullable', 'string', 'max:190'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.max' => 'El archivo no puede superar los 10 MB.',
            'file.mimes' => 'Formato no permitido. Usa JPG, PNG, WebP, GIF, SVG o PDF.',
        ];
    }
}
