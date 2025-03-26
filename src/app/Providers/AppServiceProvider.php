<?php

namespace App\Providers;

use App\Models\PersonalAccessToken;
use App\Services\CategoryService;
use App\Services\LocationService;
use App\Services\ManufacturerService;
use App\Services\SetupService;
use App\Services\UserService;
use App\Services\VehicleService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(UserService::class, function () {
            return new UserService();
        });

        $this->app->singleton(LocationService::class, function () {
            return new LocationService();
        });

        $this->app->singleton(CategoryService::class, function () {
            return new CategoryService();
        });

        $this->app->singleton(ManufacturerService::class, function () {
            return new ManufacturerService();
        });

        $this->app->singleton(VehicleService::class, function () {
            return new VehicleService();
        });

        $this->app->singleton(SetupService::class, function () {
            return new SetupService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }
}
