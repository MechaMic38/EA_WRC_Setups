<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SetupResource;
use App\Models\Setup;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Gate;

class SetupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): ResourceCollection
    {
        $setups = Setup::paginate(15);
        return SetupResource::collection($setups);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Setup::class);

        // TODO: add validation and store logic
    }

    /**
     * Display the specified resource.
     */
    public function show(string $setup)
    {
        $setup = Setup::with(['user', 'location', 'vehicle'])->find($setup);

        if (!$setup) {
            return response()->json(['error' => 'Setup not found.'], 404);
        }

        return new SetupResource($setup);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Setup $setup)
    {
        Gate::authorize('update', $setup);

        // TODO: add validation and update logic
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setup $setup)
    {
        Gate::authorize('delete', $setup);

        $setup->delete();
    }
}
