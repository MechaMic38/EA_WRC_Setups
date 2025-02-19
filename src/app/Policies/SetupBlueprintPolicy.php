<?php

namespace App\Policies;

use App\Models\SetupBlueprint;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SetupBlueprintPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        // TODO: Only admin can create setup blueprints.
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SetupBlueprint $setupBlueprint)
    {
        // TODO: Only admin can update setup blueprints.
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SetupBlueprint $setupBlueprint)
    {
        // TODO: Only admin can delete setup blueprints.
    }
}
