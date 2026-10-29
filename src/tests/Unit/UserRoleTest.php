<?php

namespace Tests\Unit;

use App\Enums\UserRole;
use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserRoleTest extends TestCase
{
    public function test_new_user_defaults_to_the_user_role(): void
    {
        $user = new User();

        $this->assertSame(UserRole::User, $user->role);
    }

    public function test_admin_role_is_recognized(): void
    {
        $user = new User();
        $user->role = UserRole::Admin->value;

        $this->assertSame(UserRole::Admin, $user->role);
        $this->assertTrue($user->isAdmin());
        $this->assertTrue($user->hasRole(UserRole::Admin));
        $this->assertFalse($user->hasRole(UserRole::User));
    }
}
