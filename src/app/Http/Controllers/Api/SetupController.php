<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Setups\StoreSetupRequest;
use App\Http\Requests\Setups\UpdateSetupRequest;
use App\Http\Resources\SetupResource;
use App\Models\Setup;
use App\Services\SetupService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Gate;

class SetupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): ResourceCollection
    {
        $setups = Setup::query()
            ->with(['user', 'location', 'vehicle'])
            // Filter by user_id (exact match)
            ->when($request->user_id, function ($query, $userId) {
                $query->where('user_id', $userId);
            })
            // Filter by location_id (exact match)
            ->when($request->location_id, function ($query, $locationId) {
                $query->where('location_id', $locationId);
            })
            // Filter by vehicle_id (exact match)
            ->when($request->vehicle_id, function ($query, $vehicleId) {
                $query->where('vehicle_id', $vehicleId);
            })
            ->paginate(15);

        return SetupResource::collection($setups);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSetupRequest $request, SetupService $setupService)
    {
        $data = $request->validated();

        $configuration = $data['configuration'];
        $data = collect($data)->except('configuration')->toArray();
        $setup = $setupService->createSetup(
            $data,
            $configuration,
            $request->user()
        );

        return new SetupResource($setup);
    }

    /**
     * Display the specified resource.
     */
    public function show(Setup $setup)
    {
        $setup->load(['user', 'location', 'vehicle', 'configuration']);
        return new SetupResource($setup);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSetupRequest $request, Setup $setup, SetupService $setupService)
    {
        $data = $request->validated();

        $configuration = $data['configuration'];
        $data = collect($data)->except('configuration')->toArray();
        $setup = $setupService->updateSetup($setup, $data, $configuration);

        return new SetupResource($setup);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setup $setup, SetupService $setupService)
    {
        Gate::authorize('delete', $setup);

        $setupService->deleteSetup($setup);

        return response()->noContent();
    }
}
