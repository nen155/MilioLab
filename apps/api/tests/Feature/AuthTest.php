<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_a_token_for_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'editor@miliolab.com',
            'password' => 'secreto',
            'role' => User::ROLE_ADMIN,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'editor@miliolab.com',
            'password' => 'secreto',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.email', 'editor@miliolab.com')
            ->assertJsonPath('user.role', 'admin')
            ->assertJsonStructure(['token']);

        $this->assertDatabaseHas('personal_access_tokens', ['tokenable_id' => $user->id]);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'editor@miliolab.com',
            'password' => 'secreto',
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'editor@miliolab.com',
            'password' => 'otra-cosa',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    public function test_me_returns_the_authenticated_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_logout_revokes_the_current_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
