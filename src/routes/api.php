<?php

use App\Enums\UserRole;
use App\Http\Controllers\Api\AuthenticatedTokenController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\ManufacturerController;
use App\Http\Controllers\Api\SetupBlueprintController;
use App\Http\Controllers\Api\SetupConfigurationController;
use App\Http\Controllers\Api\SetupController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
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
Route::post('/login', [AuthenticatedTokenController::class, 'login']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Locations
Route::get('/locations', [LocationController::class, 'index']);
Route::get('/locations/{location}', [LocationController::class, 'show']);

// Manufacturers
Route::get('/manufacturers', [ManufacturerController::class, 'index']);
Route::get('/manufacturers/{manufacturer}', [ManufacturerController::class, 'show']);

// Setups
Route::get('/setups', [SetupController::class, 'index']);
Route::get('/setups/{setup}', [SetupController::class, 'show']);

// Setup Blueprints
Route::get('/setup-blueprints', [SetupBlueprintController::class, 'index']);
Route::get('/setup-blueprints/{setupBlueprint}', [SetupBlueprintController::class, 'show']);

// Setup Configurations
Route::get('/setup-configurations', [SetupConfigurationController::class, 'index']);
Route::get('/setup-configurations/{setupConfiguration}', [SetupConfigurationController::class, 'show']);

// Vehicles
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show']);

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
    Route::get('/user', function (Request $request) {
        return new UserResource($request->user());
    });
    Route::get('/logout', [AuthenticatedTokenController::class, 'logout']);

    // Categories
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::patch('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Locations
    Route::post('/locations', [LocationController::class, 'store']);
    Route::patch('/locations/{location}', [LocationController::class, 'update']);
    Route::delete('/locations/{location}', [LocationController::class, 'destroy']);

    // Manufacturers
    Route::post('/manufacturers', [ManufacturerController::class, 'store']);
    Route::patch('/manufacturers/{manufacturer}', [ManufacturerController::class, 'update']);
    Route::delete('/manufacturers/{manufacturer}', [ManufacturerController::class, 'destroy']);

    // Setups
    Route::post('/setups', [SetupController::class, 'store']);
    Route::patch('/setups/{setup}', [SetupController::class, 'update']);
    Route::delete('/setups/{setup}', [SetupController::class, 'destroy']);

    // Vehicles
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::patch('/vehicles/{vehicle}', [VehicleController::class, 'update']);
    Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy']);
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
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::patch('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
});
