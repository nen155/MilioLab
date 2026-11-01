<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MenuItemRequest;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MenuItemController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return MenuItemResource::collection(
            MenuItem::query()
                ->with(['page', 'children.page'])
                ->whereNull('parent_id')
                ->orderBy('position')
                ->get()
        );
    }

    public function store(MenuItemRequest $request): JsonResponse
    {
        $item = MenuItem::query()->create($request->validated());

        return (new MenuItemResource($item->load('page')))->response()->setStatusCode(201);
    }

    public function update(MenuItemRequest $request, MenuItem $menuItem): MenuItemResource
    {
        $menuItem->update($request->validated());

        return new MenuItemResource($menuItem->load('page'));
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        $menuItem->delete();

        return response()->json(['message' => 'Enlace eliminado.']);
    }

    /**
     * Reordena el menú completo de una vez (arrastrar y soltar en el panel).
     */
    public function reorder(Request $request): AnonymousResourceCollection
    {
        $data = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.position' => ['required', 'integer', 'min:0'],
            'items.*.parent_id' => ['nullable', 'integer', 'exists:menu_items,id'],
        ]);

        foreach ($data['items'] as $item) {
            MenuItem::query()->whereKey($item['id'])->update([
                'position' => $item['position'],
                'parent_id' => $item['parent_id'] ?? null,
            ]);
        }

        return MenuItemResource::collection(
            MenuItem::query()
                ->with(['page', 'children.page'])
                ->whereNull('parent_id')
                ->orderBy('position')
                ->get()
        );
    }
}
