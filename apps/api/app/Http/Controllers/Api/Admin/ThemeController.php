<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ThemeController extends Controller
{
    /**
     * @return array<string, mixed>
     */
    public function index(): array
    {
        return [
            'data' => Theme::query()->orderByDesc('is_active')->orderBy('name')->get()
                ->map(fn (Theme $theme) => $this->payload($theme))
                ->all(),
            'allowed' => Theme::ALLOWED_TOKENS,
            'layouts' => Theme::LAYOUTS,
        ];
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $theme = Theme::query()->create($data);

        if (($request->boolean('activate')) || Theme::query()->count() === 1) {
            $theme->activate();
        }

        return response()->json(['data' => $this->payload($theme->fresh())], 201);
    }

    public function update(Request $request, Theme $theme): JsonResponse
    {
        $theme->update($this->validated($request, $theme));

        return response()->json(['data' => $this->payload($theme->fresh())]);
    }

    public function destroy(Theme $theme): JsonResponse
    {
        if ($theme->is_active) {
            throw ValidationException::withMessages([
                'theme' => ['No se puede borrar el tema activo. Activa otro primero.'],
            ]);
        }

        $theme->delete();

        return response()->json(['message' => 'Tema eliminado.']);
    }

    public function activate(Theme $theme): JsonResponse
    {
        $theme->activate();

        return response()->json(['data' => $this->payload($theme->fresh())]);
    }

    /**
     * Importa un tema pegado como JSON: { "name": "...", "tokens": { ... } }.
     */
    public function import(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'tokens' => ['required', 'array'],
            'activate' => ['nullable', 'boolean'],
        ]);

        $theme = Theme::query()->create([
            'name' => $data['name'],
            'tokens' => Theme::sanitizeTokens($data['tokens']),
            'layout' => $request->input('layout', 'notebook'),
            'is_active' => false,
        ]);

        if ($request->boolean('activate')) {
            $theme->activate();
        }

        return response()->json(['data' => $this->payload($theme->fresh())], 201);
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Theme $theme = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:120'],
            'tokens' => ['required', 'array'],
            'layout' => ['nullable', Rule::in(Theme::LAYOUTS)],
        ]);

        $tokens = Theme::sanitizeTokens($data['tokens']);

        if ($tokens === []) {
            throw ValidationException::withMessages([
                'tokens' => ['El tema no tiene ninguna variable válida.'],
            ]);
        }

        return [
            'name' => $data['name'],
            'slug' => $data['slug'] ?? null,
            'tokens' => $tokens,
            'layout' => $data['layout'] ?? $theme?->layout ?? 'notebook',
            'is_active' => $theme?->is_active ?? false,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(Theme $theme): array
    {
        return [
            'id' => $theme->id,
            'name' => $theme->name,
            'slug' => $theme->slug,
            'tokens' => $theme->tokens,
            'layout' => $theme->layout,
            'is_active' => $theme->is_active,
            'updated_at' => $theme->updated_at?->toIso8601String(),
        ];
    }
}
