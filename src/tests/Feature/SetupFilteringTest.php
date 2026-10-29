<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Location;
use App\Models\Manufacturer;
use App\Models\Setup;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\MongoTestCase;

class SetupFilteringTest extends MongoTestCase
{
    use DatabaseMigrations;

    public function test_public_setup_list_can_be_filtered_by_season(): void
    {
        $this->createRelatedRecords();
        $this->createSetup('setup-winter', 'user-owner', 'location-monte-carlo', 'vehicle-yaris', 'winter');
        $this->createSetup('setup-summer', 'user-owner', 'location-monte-carlo', 'vehicle-yaris', 'summer');

        $this->getJson('/api/setups?season=winter')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', 'setup-winter')
            ->assertJsonPath('data.0.season', 'winter');
    }

    public function test_public_setup_list_can_be_filtered_by_location(): void
    {
        $this->createRelatedRecords();
        $this->createLocation('location-finland', 'Finland');
        $this->createSetup('setup-monte-carlo', 'user-owner', 'location-monte-carlo', 'vehicle-yaris', 'winter');
        $this->createSetup('setup-finland', 'user-owner', 'location-finland', 'vehicle-yaris', 'winter');

        $this->getJson('/api/setups?location_id=location-monte-carlo')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', 'setup-monte-carlo');
    }

    public function test_public_setup_list_can_be_filtered_by_vehicle(): void
    {
        $this->createRelatedRecords();
        $this->createVehicle('vehicle-puma', 'Ford Puma Rally1');
        $this->createSetup('setup-yaris', 'user-owner', 'location-monte-carlo', 'vehicle-yaris', 'winter');
        $this->createSetup('setup-puma', 'user-owner', 'location-monte-carlo', 'vehicle-puma', 'winter');

        $this->getJson('/api/setups?vehicle_id=vehicle-yaris')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', 'setup-yaris');
    }

    private function createRelatedRecords(): void
    {
        $user = User::factory()->make(['email' => 'setup-owner@example.com']);
        $user->setAttribute('_id', 'user-owner');
        $user->save();

        $this->saveDocument(Category::class, 'category-rally1', ['name' => 'Rally1', 'img_path' => 'tests/category.png']);
        $this->saveDocument(Manufacturer::class, 'manufacturer-toyota', ['name' => 'Toyota', 'img_path' => 'tests/manufacturer.png']);
        $this->createVehicle('vehicle-yaris', 'Toyota GR Yaris Rally1');
        $this->createLocation('location-monte-carlo', 'Monte Carlo');
    }

    private function createLocation(string $id, string $name): Location
    {
        /** @var Location $location */
        $location = $this->saveDocument(Location::class, $id, [
            'name' => $name,
            'description' => 'Test rally location',
            'surface_type' => 'tarmac',
            'img_banner_path' => 'tests/location-banner.png',
            'img_bg_path' => 'tests/location-background.png',
        ]);
        return $location;
    }

    private function createVehicle(string $id, string $name): Vehicle
    {
        $category = Category::where('_id', 'category-rally1')->firstOrFail();
        $manufacturer = Manufacturer::where('_id', 'manufacturer-toyota')->firstOrFail();

        /** @var Vehicle $vehicle */
        $vehicle = $this->saveDocument(Vehicle::class, $id, [
            'name' => $name,
            'category_id' => $category->id,
            'manufacturer_id' => $manufacturer->id,
            'img_path' => 'tests/vehicle.png',
        ]);
        return $vehicle;
    }

    private function createSetup(string $id, string $userId, string $locationId, string $vehicleId, string $season): Setup
    {
        /** @var Setup $setup */
        $setup = $this->saveDocument(Setup::class, $id, [
            'surface_condition' => 'dry',
            'season' => $season,
            'tyres' => 'asphalt_soft',
            'user_id' => $userId,
            'location_id' => $locationId,
            'vehicle_id' => $vehicleId,
        ]);
        return $setup;
    }

    /** @param class-string<Model> $class @param array<string, mixed> $attributes */
    private function saveDocument(string $class, string $id, array $attributes): Model
    {
        $model = new $class();
        $model->forceFill($attributes);
        $model->setAttribute('_id', $id);
        $model->save();
        return $model;
    }
}
