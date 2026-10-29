<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Sanctum\Sanctum;
use Tests\MongoTestCase;

class ProfileTest extends MongoTestCase
{
    use DatabaseMigrations;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->get('/profile')->assertOk();
    }

    public function test_profile_information_can_be_updated_through_the_api(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->patchJson('/api/profile', [
            'username' => 'Updated User',
            'email' => 'updated@example.com',
        ])->assertOk();

        $user->refresh();
        $this->assertSame('Updated User', $user->username);
        $this->assertSame('updated@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_email_is_unchanged(): void
    {
        $user = User::factory()->create();
        $verifiedAt = $user->email_verified_at;
        Sanctum::actingAs($user);

        $this->patchJson('/api/profile', [
            'username' => 'Updated User',
            'email' => $user->email,
        ])->assertOk();

        $this->assertEquals($verifiedAt, $user->fresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->deleteJson('/api/profile', ['password' => 'password'])->assertNoContent();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->deleteJson('/api/profile', ['password' => 'wrong-password'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');

        $this->assertNotNull($user->fresh());
    }
}
