<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminContentTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => User::ROLE_ADMIN]);
    }

    public function test_creating_content_requires_authentication(): void
    {
        $this->postJson('/api/v1/admin/posts', ['title' => 'Sin sesión'])->assertUnauthorized();
    }

    public function test_a_post_can_be_created_with_a_generated_slug(): void
    {
        $response = $this->actingAs($this->admin())->postJson('/api/v1/admin/posts', [
            'title' => 'Mi primera entrada',
            'body' => '<p>Contenido</p>',
            'status' => 'published',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.slug', 'mi-primera-entrada')
            ->assertJsonPath('data.status', 'published');

        $this->assertNotNull($response->json('data.published_at'));
    }

    public function test_the_body_is_sanitized_before_saving(): void
    {
        $response = $this->actingAs($this->admin())->postJson('/api/v1/admin/posts', [
            'title' => 'Con script',
            'body' => '<p>Hola</p><script>alert(1)</script><iframe src="https://evil.example"></iframe>',
        ]);

        $response->assertCreated();
        $body = (string) $response->json('data.body');

        $this->assertStringContainsString('<p>Hola</p>', $body);
        $this->assertStringNotContainsString('<script', $body);
        $this->assertStringNotContainsString('evil.example', $body);
    }

    public function test_repeated_titles_get_unique_slugs(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->postJson('/api/v1/admin/posts', ['title' => 'Repetida'])->assertCreated();
        $this->actingAs($admin)->postJson('/api/v1/admin/posts', ['title' => 'Repetida'])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'repetida-2');
    }

    public function test_a_post_can_be_updated_with_tags_and_category(): void
    {
        $admin = $this->admin();
        $category = Category::query()->create(['name' => 'Noticias']);
        $tag = Tag::query()->create(['name' => 'Angular']);
        $post = Post::query()->create(['title' => 'Original', 'status' => Post::STATUS_DRAFT]);

        $response = $this->actingAs($admin)->putJson("/api/v1/admin/posts/{$post->id}", [
            'title' => 'Actualizada',
            'category_id' => $category->id,
            'tags' => [$tag->id],
        ]);

        $response->assertOk()->assertJsonPath('data.title', 'Actualizada');
        $this->assertDatabaseHas('post_tag', ['post_id' => $post->id, 'tag_id' => $tag->id]);
    }

    public function test_a_post_can_be_deleted(): void
    {
        $post = Post::query()->create(['title' => 'Temporal']);

        $this->actingAs($this->admin())
            ->deleteJson("/api/v1/admin/posts/{$post->id}")
            ->assertOk();

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    public function test_pages_can_be_managed(): void
    {
        $admin = $this->admin();

        $created = $this->actingAs($admin)->postJson('/api/v1/admin/pages', [
            'title' => 'Contacto',
            'body' => '<p>Escríbeme</p>',
            'status' => 'published',
        ])->assertCreated()->json('data');

        $this->actingAs($admin)->getJson('/api/v1/admin/pages/'.$created['id'])
            ->assertOk()
            ->assertJsonPath('data.slug', 'contacto');

        $this->actingAs($admin)->deleteJson('/api/v1/admin/pages/'.$created['id'])->assertOk();
        $this->assertDatabaseMissing('pages', ['id' => $created['id']]);
    }

    public function test_categories_and_tags_can_be_managed(): void
    {
        $admin = $this->admin();

        $category = $this->actingAs($admin)->postJson('/api/v1/admin/categories', ['name' => 'Proyectos'])
            ->assertCreated()->assertJsonPath('data.slug', 'proyectos')->json('data');

        $tag = $this->actingAs($admin)->postJson('/api/v1/admin/tags', ['name' => 'Laravel'])
            ->assertCreated()->assertJsonPath('data.slug', 'laravel')->json('data');

        $this->actingAs($admin)->putJson('/api/v1/admin/categories/'.$category['id'], ['name' => 'Proyectos nuevos'])
            ->assertOk()->assertJsonPath('data.name', 'Proyectos nuevos');

        $this->actingAs($admin)->deleteJson('/api/v1/admin/tags/'.$tag['id'])->assertOk();
        $this->assertDatabaseMissing('tags', ['id' => $tag['id']]);
    }

    public function test_menu_items_can_be_created_and_reordered(): void
    {
        $admin = $this->admin();
        $page = Page::query()->create(['title' => 'Inicio', 'status' => Page::STATUS_PUBLISHED]);

        $item = $this->actingAs($admin)->postJson('/api/v1/admin/menu-items', [
            'label' => 'Inicio',
            'page_id' => $page->id,
        ])->assertCreated()->assertJsonPath('data.url', '/inicio')->json('data');

        $this->actingAs($admin)->putJson('/api/v1/admin/menu-items/order', [
            'items' => [['id' => $item['id'], 'position' => 3]],
        ])->assertOk();

        $this->assertDatabaseHas('menu_items', ['id' => $item['id'], 'position' => 3]);
    }

    public function test_stats_returns_counts(): void
    {
        Post::query()->create(['title' => 'Una', 'status' => Post::STATUS_PUBLISHED]);
        Post::query()->create(['title' => 'Dos', 'status' => Post::STATUS_DRAFT]);

        $this->actingAs($this->admin())
            ->getJson('/api/v1/admin/stats')
            ->assertOk()
            ->assertJsonPath('posts.total', 2)
            ->assertJsonPath('posts.published', 1)
            ->assertJsonPath('posts.drafts', 1);
    }
}
