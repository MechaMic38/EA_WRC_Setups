<?php

namespace App\Policies;

use App\Models\Location;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LocationPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        // TODO: Only admin can create locations
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Location $location)
    {
        // TODO: Only admin can update locations
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Location $location)
    {
        // TODO: Only admin can delete locations
    }
}
