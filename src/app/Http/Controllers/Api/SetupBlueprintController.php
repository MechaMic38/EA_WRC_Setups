<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateVehicleBlueprintRequest;
use App\Http\Resources\SetupBlueprintResource;
use App\Models\Vehicle;

class SetupBlueprintController extends Controller
{
    /**
     * Get the blueprint for the specified vehicle.
     */
    public function show(Vehicle $vehicle)
    {
        if (is_null($vehicle->setupBlueprint)) {
            return response()->json(['error' => 'Setup blueprint not found.'], 404);
        }

        return new SetupBlueprintResource($vehicle->setupBlueprint);
    }

    /**
     * Update the blueprint for the specified vehicle.
     */
    public function update(UpdateVehicleBlueprintRequest $request, Vehicle $vehicle)
    {
        $data = $request->validated();

        // Update the vehicle's setup blueprint
        $vehicle->setupBlueprint->update($data);

        return new SetupBlueprintResource($vehicle->setupBlueprint);
    }
}
