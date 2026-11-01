<?php

namespace Tests\Feature;

use App\Models\Theme;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ThemeTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => User::ROLE_ADMIN]);
    }

    public function test_a_theme_can_be_created_and_activated(): void
    {
        $admin = $this->admin();

        $theme = $this->actingAs($admin)->postJson('/api/v1/admin/themes', [
            'name' => 'Papel viejo',
            'tokens' => ['--paper' => '#f4efe3', '--ink' => '#1b1a17', '--accent' => '#8b5e34'],
        ])->assertCreated()->json('data');

        $this->actingAs($admin)
            ->postJson("/api/v1/admin/themes/{$theme['id']}/activate")
            ->assertOk()
            ->assertJsonPath('data.is_active', true);

        $this->assertTrue(Theme::query()->find($theme['id'])->is_active);
    }

    public function test_only_one_theme_is_active(): void
    {
        $admin = $this->admin();

        $a = Theme::query()->create(['name' => 'A', 'tokens' => ['--ink' => '#000'], 'is_active' => true]);
        $b = Theme::query()->create(['name' => 'B', 'tokens' => ['--ink' => '#111']]);

        $this->actingAs($admin)->postJson("/api/v1/admin/themes/{$b->id}/activate")->assertOk();

        $this->assertFalse($a->fresh()->is_active);
        $this->assertTrue($b->fresh()->is_active);
    }

    public function test_dangerous_tokens_are_discarded(): void
    {
        $theme = $this->actingAs($this->admin())->postJson('/api/v1/admin/themes', [
            'name' => 'Inyección',
            'tokens' => [
                '--paper' => '#fff; } body { display:none',
                '--ink' => '#000',
                'background-image' => 'url(javascript:alert(1))',
            ],
        ])->assertCreated()->json('data');

        $this->assertSame(['--ink' => '#000'], $theme['tokens']);
    }

    public function test_a_theme_can_be_imported_from_json(): void
    {
        $response = $this->actingAs($this->admin())->postJson('/api/v1/admin/themes/import', [
            'name' => 'Importado',
            'tokens' => ['--paper' => '#0f0f0f', '--ink' => '#fafafa', '--accent' => '#22d3ee'],
            'activate' => true,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Importado')
            ->assertJsonPath('data.is_active', true);
    }

    public function test_the_active_theme_is_public(): void
    {
        Theme::query()->create(['name' => 'Público', 'tokens' => ['--accent' => '#ff0000'], 'is_active' => true]);

        $this->getJson('/api/v1/site')
            ->assertOk()
            ->assertJsonPath('theme.name', 'Público')
            ->assertJsonPath('theme.tokens.--accent', '#ff0000');
    }

    public function test_the_active_theme_cannot_be_deleted(): void
    {
        $theme = Theme::query()->create(['name' => 'Activo', 'tokens' => ['--ink' => '#000'], 'is_active' => true]);

        $this->actingAs($this->admin())
            ->deleteJson("/api/v1/admin/themes/{$theme->id}")
            ->assertStatus(422);
    }
}
