<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\ManufacturerController;
use App\Http\Controllers\Api\SetupBlueprintController;
use App\Http\Controllers\Api\SetupConfigurationController;
use App\Http\Controllers\Api\SetupController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::patch('/categories/{category}', [CategoryController::class, 'update']);
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

Route::get('/locations', [LocationController::class, 'index']);
Route::get('/locations/{location}', [LocationController::class, 'show']);
Route::post('/locations', [LocationController::class, 'store']);
Route::patch('/locations/{location}', [LocationController::class, 'update']);
Route::delete('/locations/{location}', [LocationController::class, 'destroy']);

Route::get('/manufacturers', [ManufacturerController::class, 'index']);
Route::get('/manufacturers/{manufacturer}', [ManufacturerController::class, 'show']);
Route::post('/manufacturers', [ManufacturerController::class, 'store']);
Route::patch('/manufacturers/{manufacturer}', [ManufacturerController::class, 'update']);
Route::delete('/manufacturers/{manufacturer}', [ManufacturerController::class, 'destroy']);

Route::get('/setups', [SetupController::class, 'index']);
Route::get('/setups/{setup}', [SetupController::class, 'show']);

Route::get('/setup-blueprints', [SetupBlueprintController::class, 'index']);
Route::get('/setup-blueprints/{setupBlueprint}', [SetupBlueprintController::class, 'show']);

Route::get('/setup-configurations', [SetupConfigurationController::class, 'index']);
Route::get('/setup-configurations/{setupConfiguration}', [SetupConfigurationController::class, 'show']);

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{user}', [UserController::class, 'show']);

Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show']);
Route::post('/vehicles', [VehicleController::class, 'store']);
Route::patch('/vehicles/{vehicle}', [VehicleController::class, 'update']);
Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy']);
