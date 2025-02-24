<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Auth\Access\Response;

class VehiclePolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->role == UserRole::Admin
            ? Response::allow()
            : Response::deny('Unauthorized.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Vehicle $vehicle): Response
    {
        return $user->role == UserRole::Admin
            ? Response::allow()
            : Response::deny('Unauthorized.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Vehicle $vehicle): Response
    {
        return $user->role == UserRole::Admin
            ? Response::allow()
            : Response::deny('Unauthorized.');
    }
}
