<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_change_their_password(): void
    {
        $user = User::factory()->create(['password' => 'actual-123']);
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/v1/admin/profile/password', [
                'current_password' => 'actual-123',
                'password' => 'nueva-1234',
                'password_confirmation' => 'nueva-1234',
            ])
            ->assertOk();

        $this->assertTrue(Hash::check('nueva-1234', $user->fresh()->password));
    }

    public function test_the_current_password_must_match(): void
    {
        $user = User::factory()->create(['password' => 'actual-123']);

        $this->actingAs($user)
            ->putJson('/api/v1/admin/profile/password', [
                'current_password' => 'otra-cosa',
                'password' => 'nueva-1234',
                'password_confirmation' => 'nueva-1234',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('current_password');
    }

    public function test_the_new_password_must_be_confirmed_and_long_enough(): void
    {
        $user = User::factory()->create(['password' => 'actual-123']);

        $this->actingAs($user)
            ->putJson('/api/v1/admin/profile/password', [
                'current_password' => 'actual-123',
                'password' => 'corta',
                'password_confirmation' => 'otra',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_changing_the_password_revokes_other_tokens(): void
    {
        $user = User::factory()->create(['password' => 'actual-123']);
        $user->createToken('otro-dispositivo');
        $token = $user->createToken('este')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/v1/admin/profile/password', [
                'current_password' => 'actual-123',
                'password' => 'nueva-1234',
                'password_confirmation' => 'nueva-1234',
            ])
            ->assertOk();

        $this->assertSame(1, $user->tokens()->count());
    }
}
