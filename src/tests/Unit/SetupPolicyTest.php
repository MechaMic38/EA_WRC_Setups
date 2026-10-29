<?php

namespace Tests\Unit;

use App\Enums\UserRole;
use App\Models\Setup;
use App\Models\User;
use App\Policies\SetupPolicy;
use PHPUnit\Framework\TestCase;

class SetupPolicyTest extends TestCase
{
    public function test_owner_can_update_their_setup(): void
    {
        $owner = $this->makeUser('owner-1');
        $setup = $this->makeSetup('owner-1');
        $this->assertTrue((new SetupPolicy())->update($owner, $setup)->allowed());
    }

    public function test_another_user_cannot_update_or_delete_the_setup(): void
    {
        $otherUser = $this->makeUser('user-2');
        $setup = $this->makeSetup('user-1');
        $policy = new SetupPolicy();
        $this->assertFalse($policy->update($otherUser, $setup)->allowed());
        $this->assertFalse($policy->delete($otherUser, $setup)->allowed());
    }

    public function test_only_regular_users_can_create_setups(): void
    {
        $policy = new SetupPolicy();
        $this->assertTrue($policy->create($this->makeUser('user-1', UserRole::User))->allowed());
        $this->assertFalse($policy->create($this->makeUser('admin-1', UserRole::Admin))->allowed());
    }

    private function makeUser(string $id, UserRole $role = UserRole::User): User
    {
        $user = new User();
        $user->setAttribute('_id', $id);
        $user->setAttribute('role', $role->value);
        return $user;
    }

    private function makeSetup(string $userId): Setup
    {
        $setup = new Setup();
        $setup->setAttribute('user_id', $userId);
        return $setup;
    }
}
