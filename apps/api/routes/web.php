<?php

use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\SitemapController;
use Illuminate\Support\Facades\Route;

// La web pública es estática: `sitemap.xml` y `feed.xml` los sirve la API y
// Apache los publica en la raíz del dominio (ver deploy/web/.htaccess).
Route::get('sitemap', SitemapController::class);
Route::get('feed', FeedController::class);

Route::get('/', fn () => response()->json([
    'name' => config('app.name'),
    'status' => 'ok',
]));
