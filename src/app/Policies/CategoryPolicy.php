<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CategoryPolicy
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
    public function update(User $user, Category $category): Response
    {
        return $user->role == UserRole::Admin
            ? Response::allow()
            : Response::deny('Unauthorized.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Category $category): Response
    {
        return $user->role == UserRole::Admin
            ? Response::allow()
            : Response::deny('Unauthorized.');
    }
}
