<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vehicles\UpdateVehicleBlueprintRequest;
use App\Http\Resources\SetupBlueprintResource;
use App\Http\Resources\SetupBlueprintWithOptionsResource;
use App\Models\Vehicle;
use App\Services\SetupBlueprintService;
use App\Services\VehicleService;

class SetupBlueprintController extends Controller
{
    /**
     * Get the blueprint for the specified vehicle.
     */
    public function show(Vehicle $vehicle, SetupBlueprintService $setupBlueprintService)
    {
        if (is_null($vehicle->setupBlueprint)) {
            return response()->json(['error' => 'Setup blueprint not found.'], 404);
        }

        $blueprint = $setupBlueprintService->mergeSetupOptions($vehicle->setupBlueprint);

        return new SetupBlueprintWithOptionsResource($blueprint);
    }

    /**
     * Update the blueprint for the specified vehicle.
     */
    public function update(UpdateVehicleBlueprintRequest $request, Vehicle $vehicle, VehicleService $vehicleService)
    {
        $data = $request->validated();

        $blueprint = $vehicleService->updateVehicleSetupBlueprint($vehicle, $data);

        return new SetupBlueprintResource($blueprint);
    }
}
