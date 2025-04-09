<?php

use App\Http\Controllers\Web\ConfirmablePasswordController;
use App\Http\Controllers\Web\EmailVerificationNotificationController;
use App\Http\Controllers\Web\EmailVerificationPromptController;
use App\Http\Controllers\Web\NewPasswordController;
use App\Http\Controllers\Web\AuthSessionController;
use App\Http\Controllers\Web\PasswordResetLinkController;
use App\Http\Controllers\Web\RegistrationController;
use App\Http\Controllers\Web\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegistrationController::class, 'create'])
        ->name('register');

    Route::post('register', [RegistrationController::class, 'store'])
        ->name('auth.register');

    Route::get('login', [AuthSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthSessionController::class, 'store'])
        ->name('auth.login');

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthSessionController::class, 'destroy'])
        ->name('auth.logout');
});
