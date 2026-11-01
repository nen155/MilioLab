<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\Post;
use App\Models\Setting;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicContentTest extends TestCase
{
    use RefreshDatabase;

    private function publishedPost(array $attributes = []): Post
    {
        return Post::query()->create(array_merge([
            'title' => 'Entrada publicada',
            'body' => '<p>Hola</p>',
            'status' => Post::STATUS_PUBLISHED,
            'published_at' => now()->subDay(),
        ], $attributes));
    }

    public function test_site_returns_settings_menu_and_home(): void
    {
        $home = Page::query()->create([
            'title' => 'Inicio',
            'body' => '<p>Bienvenido</p>',
            'status' => Page::STATUS_PUBLISHED,
        ]);

        Setting::query()->create(['key' => 'site_name', 'value' => 'MilioLab']);
        Setting::query()->create(['key' => 'home_page_id', 'value' => (string) $home->id, 'type' => 'int']);

        MenuItem::query()->create(['label' => 'Inicio', 'page_id' => $home->id, 'position' => 0]);

        $this->getJson('/api/v1/site')
            ->assertOk()
            ->assertJsonPath('settings.site_name', 'MilioLab')
            ->assertJsonPath('home', 'inicio')
            ->assertJsonPath('menu.0.label', 'Inicio')
            ->assertJsonPath('menu.0.url', '/inicio');
    }

    public function test_a_published_page_can_be_read_by_slug(): void
    {
        Page::query()->create([
            'title' => 'Sobre mí',
            'body' => '<p>Bio</p>',
            'status' => Page::STATUS_PUBLISHED,
        ]);

        $this->getJson('/api/v1/pages/sobre-mi')
            ->assertOk()
            ->assertJsonPath('data.title', 'Sobre mí')
            ->assertJsonPath('data.body', '<p>Bio</p>');
    }

    public function test_a_draft_page_is_not_public(): void
    {
        Page::query()->create([
            'title' => 'Borrador',
            'body' => '<p>Nada</p>',
            'status' => Page::STATUS_DRAFT,
        ]);

        $this->getJson('/api/v1/pages/borrador')->assertNotFound();
    }

    public function test_posts_list_only_returns_published_entries(): void
    {
        $this->publishedPost();
        $this->publishedPost(['title' => 'Borrador', 'status' => Post::STATUS_DRAFT]);

        $this->getJson('/api/v1/posts')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Entrada publicada');
    }

    public function test_posts_can_be_filtered_by_category_and_tag(): void
    {
        $category = Category::query()->create(['name' => 'Noticias']);
        $tag = Tag::query()->create(['name' => 'Angular']);

        $post = $this->publishedPost(['category_id' => $category->id]);
        $post->tags()->attach($tag);

        $this->getJson('/api/v1/posts?category=noticias')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/v1/posts?tag=angular')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/v1/posts?category=otra')->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_a_published_post_can_be_read_by_slug(): void
    {
        $author = User::factory()->create(['name' => 'Emilio']);
        $this->publishedPost(['author_id' => $author->id]);

        $this->getJson('/api/v1/posts/entrada-publicada')
            ->assertOk()
            ->assertJsonPath('data.body', '<p>Hola</p>')
            ->assertJsonPath('data.author.name', 'Emilio')
            ->assertJsonPath('data.reading_minutes', 1);
    }

    public function test_a_draft_post_is_not_public(): void
    {
        $this->publishedPost(['status' => Post::STATUS_DRAFT]);

        $this->getJson('/api/v1/posts/entrada-publicada')->assertNotFound();
    }

    public function test_categories_and_tags_only_count_published_posts(): void
    {
        $category = Category::query()->create(['name' => 'Noticias']);
        $this->publishedPost(['category_id' => $category->id]);
        $this->publishedPost(['category_id' => $category->id, 'status' => Post::STATUS_DRAFT]);

        $this->getJson('/api/v1/categories')
            ->assertOk()
            ->assertJsonPath('data.0.posts_count', 1);
    }

    public function test_sitemap_lists_pages_and_posts(): void
    {
        Page::query()->create(['title' => 'Sobre mí', 'status' => Page::STATUS_PUBLISHED]);
        $this->publishedPost();

        $response = $this->get('/sitemap');
        $base = rtrim((string) config('app.url'), '/');

        $response->assertOk();
        $this->assertStringContainsString("<loc>{$base}/sobre-mi</loc>", $response->getContent());
        $this->assertStringContainsString("<loc>{$base}/blog/entrada-publicada</loc>", $response->getContent());
    }
}
