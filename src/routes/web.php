<?php

use App\Enums\UserRole;
use App\Http\Controllers\Web\CategoryController;
use App\Http\Controllers\Web\LocationController;
use App\Http\Controllers\Web\ManufacturerController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\SetupController;
use App\Http\Controllers\Web\UserController;
use App\Http\Controllers\Web\VehicleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
|
| These routes are available without authentication.
|
*/

Route::get('/', function () {
    return Inertia::render('Public/Welcome', []);
});

Route::get('/about', function () {
    return Inertia::render('Public/About');
})->name('about');

Route::get('/locations', [LocationController::class, 'index'])->name('locations.index');
Route::get('/locations/{location}/setups', [LocationController::class, 'show'])->name('locations.show');

Route::get('/setups', [SetupController::class, 'index'])->name('setups.index');
Route::get('/setups/{setup}', [SetupController::class, 'show'])->name('setups.show');

Route::get('/vehicles', [VehicleController::class, 'index'])->name('vehicles.index');
Route::get('/vehicles/{vehicle}/setups', [VehicleController::class, 'show'])->name('vehicles.show');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
|
| These routes require the user to be authenticated.
|
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Setup creation wizard
    Route::get('/setups/create/location', [SetupController::class, 'createLocation'])->name('setups.create.location');
    Route::get('/setups/create/vehicle', [SetupController::class, 'createVehicle'])->name('setups.create.vehicle');
    Route::get('/setups/create/options', [SetupController::class, 'createOptions'])->name('setups.create.options');
    Route::get('/setups/create/configuration', [SetupController::class, 'createConfiguration'])->name('setups.create.configuration');
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

Route::prefix('admin')
    ->middleware(['auth', 'role:' . UserRole::Admin->value])
    ->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin');

        Route::get('/categories', [CategoryController::class, 'index'])->name('admin.categories.index');
        Route::get('/locations', [LocationController::class, 'adminIndex'])->name('admin.locations.index');
        Route::get('/manufacturers', [ManufacturerController::class, 'index'])->name('admin.manufacturers.index');
        Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');
        Route::get('/vehicles', [VehicleController::class, 'adminIndex'])->name('admin.vehicles.index');
    });


require __DIR__ . '/auth.php';
