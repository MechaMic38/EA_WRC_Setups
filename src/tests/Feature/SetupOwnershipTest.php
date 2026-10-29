<?php

namespace Tests\Feature;

use App\Models\Setup;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Sanctum\Sanctum;
use Tests\MongoTestCase;

class SetupOwnershipTest extends MongoTestCase
{
    use DatabaseMigrations;

    public function test_user_cannot_update_another_users_setup(): void
    {
        $owner = $this->createUser('setup-owner@example.com', 'user-owner');
        $otherUser = $this->createUser('other-user@example.com', 'user-other');
        $setup = $this->createSetup($owner);
        Sanctum::actingAs($otherUser);

        $this->patchJson('/api/setups/' . $setup->id, ['season' => 'summer'])->assertForbidden();
        $this->assertSame('winter', $setup->fresh()->season);
    }

    public function test_user_cannot_delete_another_users_setup(): void
    {
        $owner = $this->createUser('setup-owner@example.com', 'user-owner');
        $otherUser = $this->createUser('other-user@example.com', 'user-other');
        $setup = $this->createSetup($owner);
        Sanctum::actingAs($otherUser);

        $this->deleteJson('/api/setups/' . $setup->id)->assertForbidden();
        $this->assertNotNull($setup->fresh());
    }

    private function createUser(string $email, string $id): User
    {
        $user = User::factory()->make(['email' => $email]);
        $user->setAttribute('_id', $id);
        $user->save();
        return $user;
    }

    private function createSetup(User $owner): Setup
    {
        $setup = new Setup();
        $setup->forceFill([
            'surface_condition' => 'dry',
            'season' => 'winter',
            'tyres' => 'asphalt_soft',
            'user_id' => $owner->id,
            'location_id' => 'location-not-needed-for-forbidden-request',
            'vehicle_id' => 'vehicle-not-needed-for-forbidden-request',
        ]);
        $setup->setAttribute('_id', 'setup-owned-by-owner');
        $setup->save();
        return $setup;
    }
}
