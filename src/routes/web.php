<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ManufacturerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VehicleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::prefix('dashboard')
    ->middleware(['auth', 'verified', 'role:admin'])
    ->group(function () {
        Route::get('/', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');

        Route::get('/categories', [CategoryController::class, 'index'])->name('dashboard.categories');
        Route::get('/locations', [LocationController::class, 'index'])->name('dashboard.locations');
        Route::get('/manufacturers', [ManufacturerController::class, 'index'])->name('dashboard.manufacturers');
        Route::get('/vehicles', [VehicleController::class, 'index'])->name('dashboard.vehicles');
    });


require __DIR__ . '/auth.php';
