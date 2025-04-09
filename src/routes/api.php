<?php

use App\Enums\UserRole;
use App\Http\Controllers\Api\AuthTokenController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\ManufacturerController;
use App\Http\Controllers\Api\PasswordController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SetupBlueprintController;
use App\Http\Controllers\Api\SetupConfigurationController;
use App\Http\Controllers\Api\SetupController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\SetupOptionsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
|
| These routes are available without authentication.
|
*/

// Authentication for external applications
Route::post('/login', [AuthTokenController::class, 'login'])->name('api.auth.login');
Route::post('/register', [AuthTokenController::class, 'register'])->name('api.auth.register');

// Categories
Route::get('/categories', [CategoryController::class, 'index'])->name('api.categories.index');
Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('api.categories.show');

// Locations
Route::get('/locations', [LocationController::class, 'index'])->name('api.locations.index');
Route::get('/locations/{location}', [LocationController::class, 'show'])->name('api.locations.show');

// Manufacturers
Route::get('/manufacturers', [ManufacturerController::class, 'index'])->name('api.manufacturers.index');
Route::get('/manufacturers/{manufacturer}', [ManufacturerController::class, 'show'])->name('api.manufacturers.show');

// Setups
Route::get('/setups', [SetupController::class, 'index'])->name('api.setups.index');
Route::get('/setups/{setup}', [SetupController::class, 'show'])->name('api.setups.show');

// Setup configurations
Route::get('/setups/{setup}/configuration', [SetupConfigurationController::class, 'show'])->name('api.setups.configuration.show');

// Setup options
Route::get('/setup-options', [SetupOptionsController::class, 'index'])->name('api.setup-options.index');

// Vehicles
Route::get('/vehicles', [VehicleController::class, 'index'])->name('api.vehicles.index');
Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show'])->name('api.vehicles.show');

// Vehicle blueprints
Route::get('/vehicles/{vehicle}/blueprint', [SetupBlueprintController::class, 'show'])->name('api.vehicles.blueprint.show');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
|
| These routes require the user to be authenticated.
|
*/

Route::middleware('auth:sanctum')->group(function () {
    // Authentication for external applications
    Route::get('/logout', [AuthTokenController::class, 'logout'])->name('api.auth.logout');

    // User profile
    Route::get('/profile', [ProfileController::class, 'show'])->name('api.profile.show');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('api.profile.update');
    Route::patch('/profile/password', [PasswordController::class, 'update'])->name('api.profile.password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('api.profile.destroy');

    // Setups
    Route::post('/setups', [SetupController::class, 'store'])->name('api.setups.store');
    Route::patch('/setups/{setup}', [SetupController::class, 'update'])->name('api.setups.update');
    Route::delete('/setups/{setup}', [SetupController::class, 'destroy'])->name('api.setups.destroy');
});

/*
|--------------------------------------------------------------------------
| Admin-Only Routes
|--------------------------------------------------------------------------
|
| These routes require the user to be authenticated and to have the admin
| role.
|
*/

Route::middleware(['auth:sanctum', 'role:' . UserRole::Admin->value])->group(function () {
    // Categories
    Route::post('/categories', [CategoryController::class, 'store'])->name('api.categories.store');
    Route::patch('/categories/{category}', [CategoryController::class, 'update'])->name('api.categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('api.categories.destroy');

    // Locations
    Route::post('/locations', [LocationController::class, 'store'])->name('api.locations.store');
    Route::patch('/locations/{location}', [LocationController::class, 'update'])->name('api.locations.update');
    Route::delete('/locations/{location}', [LocationController::class, 'destroy'])->name('api.locations.destroy');

    // Manufacturers
    Route::post('/manufacturers', [ManufacturerController::class, 'store'])->name('api.manufacturers.store');
    Route::patch('/manufacturers/{manufacturer}', [ManufacturerController::class, 'update'])->name('api.manufacturers.update');
    Route::delete('/manufacturers/{manufacturer}', [ManufacturerController::class, 'destroy'])->name('api.manufacturers.destroy');

    // Users
    Route::get('/users', [UserController::class, 'index'])->name('api.users.index');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('api.users.show');
    Route::post('/users', [UserController::class, 'store'])->name('api.users.store');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('api.users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('api.users.destroy');

    // Vehicles
    Route::post('/vehicles', [VehicleController::class, 'store'])->name('api.vehicles.store');
    Route::patch('/vehicles/{vehicle}', [VehicleController::class, 'update'])->name('api.vehicles.update');
    Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy'])->name('api.vehicles.destroy');

    // Vehicle blueprints
    Route::patch('/vehicles/{vehicle}/blueprint', [SetupBlueprintController::class, 'update'])->name('api.vehicles.blueprint.update');
});
