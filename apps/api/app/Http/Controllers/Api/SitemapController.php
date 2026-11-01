<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\Setting;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * `sitemap.xml` del sitio (páginas, entradas y categorías publicadas).
     *
     * En producción se sirve en `/sitemap.xml` mediante una regla de Apache que
     * lo redirige a la API (ver `deploy/web/.htaccess`).
     */
    public function __invoke(): Response
    {
        $base = rtrim((string) Setting::value('site_url', config('app.url')), '/');

        $urls = collect([['loc' => $base.'/', 'priority' => '1.0']])
            ->push(['loc' => $base.'/blog', 'priority' => '0.8']);

        Page::query()->published()->orderBy('slug')->get()->each(function (Page $page) use ($urls, $base): void {
            $urls->push([
                'loc' => $base.'/'.$page->slug,
                'lastmod' => $page->updated_at?->toAtomString(),
                'priority' => '0.7',
            ]);
        });

        Post::query()->published()->orderByDesc('published_at')->get()->each(function (Post $post) use ($urls, $base): void {
            $urls->push([
                'loc' => $base.'/blog/'.$post->slug,
                'lastmod' => $post->updated_at?->toAtomString(),
                'priority' => '0.6',
            ]);
        });

        Category::query()->orderBy('slug')->get()->each(function (Category $category) use ($urls, $base): void {
            $urls->push([
                'loc' => $base.'/blog/categoria/'.$category->slug,
                'priority' => '0.4',
            ]);
        });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($urls as $url) {
            $xml .= '  <url><loc>'.htmlspecialchars($url['loc'], ENT_XML1).'</loc>';
            if (! empty($url['lastmod'])) {
                $xml .= '<lastmod>'.$url['lastmod'].'</lastmod>';
            }
            $xml .= '<priority>'.$url['priority'].'</priority></url>'."\n";
        }

        $xml .= '</urlset>'."\n";

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }
}
