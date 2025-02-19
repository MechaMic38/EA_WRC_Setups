<?php

namespace App\Policies;

use App\Models\SetupConfiguration;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SetupConfigurationPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        // TODO: Only admin can create setup configurations.
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SetupConfiguration $setupConfiguration)
    {
        // TODO: Only admin can update setup configurations.
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SetupConfiguration $setupConfiguration)
    {
        // TODO: Only admin can delete setup configurations.
    }
}
