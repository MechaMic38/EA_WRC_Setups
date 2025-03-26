<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService extends Service
{
    /**
     * Create a new user.
     *
     * @param array $data
     * @return \App\Models\User
     */
    public function createUser(array $data): User
    {
        // Hash the password
        $data['password'] = Hash::make($data['password']);

        // Create a new user record
        $user = User::create($data);

        return $user;
    }

    /**
     * Update a user.
     *
     * @param \App\Models\User $user
     * @param array $data
     * @return \App\Models\User
     */
    public function updateUser(User $user, array $data): User
    {
        $user->update($data);

        return $user;
    }

    /**
     * Delete a user.
     *
     * @param \App\Models\User $user
     * @return void
     */
    public function deleteUser(User $user): void
    {
        $user->delete();
    }
}
