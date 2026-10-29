<?php

namespace Tests\Feature;

use App\Models\Setup;
use App\Models\SetupConfiguration;
use App\Models\User;
use App\Services\SetupService;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use RuntimeException;
use Tests\MongoTestCase;

class SetupServiceTransactionTest extends MongoTestCase
{
    use DatabaseMigrations;

    public function test_create_setup_persists_setup_and_configuration(): void
    {
        $user = $this->createUser();

        $setup = app(SetupService::class)->createSetup(
            $this->setupData(),
            $this->configurationData(),
            $user,
        );

        $this->assertNotNull(Setup::query()->find($setup->getKey()));
        $this->assertNotNull(SetupConfiguration::query()->find($setup->getKey()));
    }

    private function createUser(): User
    {
        return User::factory()->create([
            'username' => 'transaction-user',
            'email' => 'transaction-user@example.com',
        ]);
    }

    /** @return array<string, mixed> */
    private function setupData(): array
    {
        return [
            'surface_condition' => 'dry',
            'season' => 'winter',
            'tyres' => 'asphalt_soft',
            'location_id' => 'transaction-test-location',
            'vehicle_id' => 'transaction-test-vehicle',
        ];
    }

    /** @return array<string, mixed> */
    private function configurationData(): array
    {
        return [
            'alignment' => [],
            'braking' => [],
            'differentials' => [],
            'gears' => [],
            'damping' => [],
            'springs' => [],
        ];
    }
}
