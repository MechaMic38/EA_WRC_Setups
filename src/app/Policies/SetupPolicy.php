<?php

namespace App\Policies;

use App\Models\Setup;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SetupPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Setup $setup): Response
    {
        return $user->id === $setup->user_id
            ? Response::allow()
            : Response::deny('You do not own this setup.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Setup $setup): Response
    {
        return $user->id === $setup->user_id
            ? Response::allow()
            : Response::deny('You do not own this setup.');
    }
}
