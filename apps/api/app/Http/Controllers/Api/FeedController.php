<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Setting;
use Illuminate\Http\Response;

class FeedController extends Controller
{
    /**
     * RSS 2.0 con las últimas entradas publicadas.
     *
     * En producción se sirve en `/feed.xml` mediante una regla de Apache
     * (ver `deploy/web/.htaccess`).
     */
    public function __invoke(): Response
    {
        $base = rtrim((string) Setting::value('site_url', config('app.url')), '/');
        $name = (string) Setting::value('site_name', config('app.name'));
        $description = (string) Setting::value('site_description', '');

        $posts = Post::query()
            ->published()
            ->orderByDesc('published_at')
            ->limit(20)
            ->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<rss version="2.0"><channel>'."\n";
        $xml .= '<title>'.htmlspecialchars($name, ENT_XML1).'</title>'."\n";
        $xml .= '<link>'.$base.'/</link>'."\n";
        $xml .= '<description>'.htmlspecialchars($description, ENT_XML1).'</description>'."\n";
        $xml .= '<language>es</language>'."\n";
        $xml .= '<lastBuildDate>'.now()->toRssString().'</lastBuildDate>'."\n";

        foreach ($posts as $post) {
            $url = $base.'/blog/'.$post->slug;

            $xml .= '<item>'."\n";
            $xml .= '<title>'.htmlspecialchars($post->title, ENT_XML1).'</title>'."\n";
            $xml .= '<link>'.$url.'</link>'."\n";
            $xml .= '<guid isPermaLink="true">'.$url.'</guid>'."\n";
            $xml .= '<pubDate>'.($post->published_at ?? $post->created_at)->toRssString().'</pubDate>'."\n";
            $xml .= '<description>'.htmlspecialchars((string) ($post->excerpt ?? ''), ENT_XML1).'</description>'."\n";
            $xml .= '</item>'."\n";
        }

        $xml .= '</channel></rss>'."\n";

        return response($xml, 200, ['Content-Type' => 'application/rss+xml; charset=UTF-8']);
    }
}
