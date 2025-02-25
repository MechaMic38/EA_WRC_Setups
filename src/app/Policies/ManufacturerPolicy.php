<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Manufacturer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ManufacturerPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Unauthorized.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Manufacturer $manufacturer): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Unauthorized.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Manufacturer $manufacturer): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Unauthorized.');
    }
}
