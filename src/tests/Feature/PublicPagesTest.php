<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // These tests verify Laravel/Inertia responses; they do not need a Vite build.
        $this->withoutVite();
    }

    public function test_homepage_renders_the_public_welcome_page(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Public/Welcome'));
    }

    public function test_about_page_renders(): void
    {
        $this->get(route('about'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Public/About'));
    }

    public function test_vehicle_index_is_public(): void
    {
        $this->get(route('vehicles.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Public/VehicleIndex'));
    }

    public function test_location_index_is_public(): void
    {
        $this->get(route('locations.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Public/LocationIndex'));
    }

    public function test_health_endpoint_returns_ok(): void
    {
        $this->get('/up')->assertOk();
    }
}
