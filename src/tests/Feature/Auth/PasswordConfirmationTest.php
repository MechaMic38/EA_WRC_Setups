<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\MongoTestCase;

class PasswordConfirmationTest extends MongoTestCase
{
    use DatabaseMigrations;

    public function test_confirm_password_screen_can_be_rendered(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->get('/confirm-password')->assertOk();
    }

    public function test_password_can_be_confirmed(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->post('/confirm-password', ['password' => 'password']);

        $response->assertRedirect(route('home', absolute: false));
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('auth.password_confirmed_at');
    }

    public function test_password_is_not_confirmed_with_invalid_password(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->from('/confirm-password')->post('/confirm-password', [
            'password' => 'wrong-password',
        ]);

        $response->assertRedirect('/confirm-password')->assertSessionHasErrors('password');
    }
}
