<?php

use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Api\Admin\MenuItemController as AdminMenuItemController;
use App\Http\Controllers\Api\Admin\PageController as AdminPageController;
use App\Http\Controllers\Api\Admin\PostController as AdminPostController;
use App\Http\Controllers\Api\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Api\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Api\Admin\StatsController as AdminStatsController;
use App\Http\Controllers\Api\Admin\TagController as AdminTagController;
use App\Http\Controllers\Api\Admin\ThemeController as AdminThemeController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\PublicPageController;
use App\Http\Controllers\Api\PublicPostController;
use App\Http\Controllers\Api\PublicThemeController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\SitemapController;
use App\Http\Controllers\Api\TaxonomyController;
use Illuminate\Support\Facades\Route;

// Sitemap y RSS (sin versión: /api/sitemap y /api/feed).
Route::get('sitemap', SitemapController::class);
Route::get('feed', FeedController::class);

/*
|--------------------------------------------------------------------------
| API pública (la web)
|--------------------------------------------------------------------------
| Solo contenido publicado. No requiere autenticación.
*/
Route::prefix('v1')->group(function (): void {
    Route::get('site', SiteController::class);
    Route::get('themes', PublicThemeController::class);
    Route::get('pages/{slug}', [PublicPageController::class, 'show']);
    Route::get('posts', [PublicPostController::class, 'index']);
    Route::get('posts/{slug}', [PublicPostController::class, 'show']);
    Route::get('categories', [TaxonomyController::class, 'categories']);
    Route::get('tags', [TaxonomyController::class, 'tags']);
});

/*
|--------------------------------------------------------------------------
| Autenticación del panel
|--------------------------------------------------------------------------
*/
Route::prefix('v1/auth')->group(function (): void {
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Panel de administración
|--------------------------------------------------------------------------
| Va bajo /admin para no chocar con las rutas públicas de mismo nombre.
*/
Route::prefix('v1/admin')->middleware('auth:sanctum')->group(function (): void {
    Route::get('stats', AdminStatsController::class);
    Route::put('profile/password', [AdminProfileController::class, 'updatePassword']);

    Route::apiResource('pages', AdminPageController::class);
    Route::apiResource('posts', AdminPostController::class);
    Route::apiResource('categories', AdminCategoryController::class)->except('show');
    Route::apiResource('tags', AdminTagController::class)->except('show');

    // Antes del resource: si no, `order` se interpreta como un id.
    Route::put('menu-items/order', [AdminMenuItemController::class, 'reorder']);
    Route::apiResource('menu-items', AdminMenuItemController::class)->except('show');

    Route::get('media', [AdminMediaController::class, 'index']);
    Route::post('media', [AdminMediaController::class, 'store']);
    Route::delete('media/{media}', [AdminMediaController::class, 'destroy']);

    Route::get('themes', [AdminThemeController::class, 'index']);
    Route::post('themes', [AdminThemeController::class, 'store']);
    Route::post('themes/import', [AdminThemeController::class, 'import']);
    Route::put('themes/{theme}', [AdminThemeController::class, 'update']);
    Route::post('themes/{theme}/activate', [AdminThemeController::class, 'activate']);
    Route::delete('themes/{theme}', [AdminThemeController::class, 'destroy']);

    Route::get('settings', [AdminSettingController::class, 'index']);
    Route::put('settings', [AdminSettingController::class, 'update'])->middleware('role:admin');
});
