<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => User::ROLE_ADMIN]);
    }

    public function test_an_image_can_be_uploaded(): void
    {
        Storage::fake('media');

        $response = $this->actingAs($this->admin())->postJson('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->image('foto.jpg', 800, 600),
            'alt' => 'Una foto',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.mime_type', 'image/jpeg')
            ->assertJsonPath('data.width', 800)
            ->assertJsonPath('data.height', 600)
            ->assertJsonPath('data.alt', 'Una foto');

        $media = Media::query()->firstOrFail();
        Storage::disk('media')->assertExists($media->path);
    }

    public function test_an_unsupported_file_is_rejected(): void
    {
        Storage::fake('media');

        $this->actingAs($this->admin())->postJson('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->create('script.php', 10, 'application/x-php'),
        ])->assertStatus(422)->assertJsonValidationErrors('file');
    }

    public function test_media_can_be_listed_and_deleted(): void
    {
        Storage::fake('media');

        $admin = $this->admin();
        $this->actingAs($admin)->postJson('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->image('a.png'),
        ])->assertCreated();

        $media = Media::query()->firstOrFail();

        $this->actingAs($admin)->getJson('/api/v1/admin/media')->assertOk()->assertJsonCount(1, 'data');

        $this->actingAs($admin)->deleteJson("/api/v1/admin/media/{$media->id}")->assertOk();
        $this->assertDatabaseCount('media', 0);
        Storage::disk('media')->assertMissing($media->path);
    }
}
