<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): ResourceCollection
    {
        $perPage = $request->input('per_page', 15);

        $users = User::query()
            // Filter by name (case-insensitive partial match)
            ->when($request->name, function ($query, $name) {
                $query->where('name', 'like', '%' . $name . '%');
            })
            // Filter by email (case-insensitive partial match)
            ->when($request->email, function ($query, $email) {
                $query->where('email', 'like', '%' . $email . '%');
            })
            // Filter by role (exact match)
            ->when($request->role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->paginate($perPage);

        return UserResource::collection($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request, UserService $userService)
    {
        $data = $request->validated();

        $user = $userService->createUser($data);

        return new UserResource($user);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user, UserService $userService)
    {
        $data = $request->validated();

        $user = $userService->updateUser($user, $data);

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, UserService $userService)
    {
        Gate::authorize('delete', $user);

        $userService->deleteUser($user);

        return response()->noContent();
    }
}
