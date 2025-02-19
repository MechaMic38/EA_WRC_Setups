<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Auth\Access\Response;

class VehiclePolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        // TODO: Only admin can create vehicles.
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Vehicle $vehicle)
    {
        // TODO: Only admin can update vehicles.
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Vehicle $vehicle)
    {
        // TODO: Only admin can delete vehicles.
    }
}
