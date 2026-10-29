<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AccessControlTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // No compiled frontend assets are needed to test route authorization.
        $this->withoutVite();
    }

    public function test_guest_is_redirected_to_login_from_profile(): void
    {
        $this->get(route('profile.edit'))
            ->assertRedirect(route('login'));
    }

    public function test_guest_is_redirected_to_login_from_setup_creation_wizard(): void
    {
        $this->get(route('setups.create.location'))
            ->assertRedirect(route('login'));
    }

    public function test_regular_user_cannot_open_admin_dashboard(): void
    {
        $user = $this->userWithRole(UserRole::User);

        $this->actingAs($user)
            ->get(route('admin'))
            ->assertRedirect(route('home'));
    }

    public function test_admin_can_open_admin_dashboard(): void
    {
        $admin = $this->userWithRole(UserRole::Admin);

        $this->actingAs($admin)
            ->get(route('admin'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Dashboard'));
    }

    public function test_authenticated_user_can_open_profile_page(): void
    {
        $user = $this->userWithRole(UserRole::User);

        $this->actingAs($user)
            ->get(route('profile.edit'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Profile/Edit'));
    }

    /**
     * Build an in-memory user for authorization tests, without persisting it.
     * These tests therefore do not need a database connection.
     */
    private function userWithRole(UserRole $role): User
    {
        $user = new User();
        $user->forceFill([
            'username' => 'Test ' . ucfirst($role->value),
            'email' => $role->value . '@example.test',
            'role' => $role->value,
        ]);

        return $user;
    }
}
