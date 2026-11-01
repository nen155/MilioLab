<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_update_the_settings(): void
    {
        $editor = User::factory()->create(['role' => User::ROLE_EDITOR]);

        $this->actingAs($editor)->putJson('/api/v1/admin/settings', [
            'settings' => [['key' => 'site_name', 'value' => 'Otro nombre']],
        ])->assertForbidden();
    }

    public function test_an_admin_can_update_several_settings_at_once(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)->putJson('/api/v1/admin/settings', [
            'settings' => [
                ['key' => 'site_name', 'value' => 'MilioLab', 'type' => 'string'],
                ['key' => 'posts_per_page', 'value' => 12, 'type' => 'int'],
                ['key' => 'show_author', 'value' => false, 'type' => 'bool'],
            ],
        ])->assertOk()->assertJsonPath('settings.posts_per_page', 12);

        $this->assertSame('MilioLab', Setting::value('site_name'));
        $this->assertSame(12, Setting::value('posts_per_page'));
        $this->assertFalse(Setting::value('show_author'));
    }

    public function test_settings_are_listed_with_their_groups(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        Setting::query()->create(['key' => 'site_name', 'value' => 'MilioLab', 'group' => 'general']);
        Setting::query()->create(['key' => 'accent_color', 'value' => '#fff', 'group' => 'apariencia']);

        $this->actingAs($admin)
            ->getJson('/api/v1/admin/settings')
            ->assertOk()
            ->assertJsonPath('settings.site_name', 'MilioLab')
            ->assertJsonStructure(['settings', 'groups' => ['general', 'apariencia']]);
    }
}
