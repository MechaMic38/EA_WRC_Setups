<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ManufacturerController;
use App\Http\Controllers\VehicleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/categories', [CategoryController::class, 'indexApi']);
Route::get('/categories/{category}', [CategoryController::class, 'showApi']);

Route::get('/locations', [LocationController::class, 'indexApi']);
Route::get('/locations/{location}', [LocationController::class, 'showApi']);

Route::get('/manufacturers', [ManufacturerController::class, 'indexApi']);
Route::get('/manufacturers/{manufacturer}', [ManufacturerController::class, 'showApi']);

Route::get('/vehicles', [VehicleController::class, 'indexApi']);
Route::get('/vehicles/{vehicle}', [VehicleController::class, 'showApi']);
