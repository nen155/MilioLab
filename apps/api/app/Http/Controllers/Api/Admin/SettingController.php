<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SettingsRequest;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    /**
     * Todos los ajustes agrupados por sección.
     *
     * @return array<string, mixed>
     */
    public function index(): array
    {
        return [
            'settings' => Setting::toArrayOfValues(),
            'groups' => Setting::query()->orderBy('group')->get()
                ->groupBy('group')
                ->map(fn ($items) => $items->map(fn (Setting $setting) => [
                    'key' => $setting->key,
                    'value' => $setting->typedValue(),
                    'type' => $setting->type,
                    'group' => $setting->group,
                ])->values())
                ->all(),
        ];
    }

    /**
     * Guarda varios ajustes a la vez (upsert por clave).
     */
    public function update(SettingsRequest $request): JsonResponse
    {
        foreach ($request->validated('settings') as $item) {
            $value = $item['value'] ?? null;

            if (is_array($value)) {
                $value = json_encode($value, JSON_UNESCAPED_UNICODE);
            } elseif (is_bool($value)) {
                $value = $value ? '1' : '0';
            }

            Setting::query()->updateOrCreate(
                ['key' => $item['key']],
                [
                    'value' => $value,
                    'type' => $item['type'] ?? Setting::TYPE_STRING,
                    'group' => $item['group'] ?? 'general',
                ],
            );
        }

        return response()->json([
            'message' => 'Ajustes guardados.',
            'settings' => Setting::toArrayOfValues(),
        ]);
    }
}
