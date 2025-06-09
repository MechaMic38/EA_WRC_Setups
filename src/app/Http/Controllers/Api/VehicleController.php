<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vehicles\StoreVehicleRequest;
use App\Http\Requests\Vehicles\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\SetupBlueprint;
use App\Models\Vehicle;
use App\Services\VehicleService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Gate;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): ResourceCollection
    {
        $perPage = $request->input('per_page', 15);

        $vehicles = Vehicle::query()
            ->with(['category', 'manufacturer'])
            // Filter by name (case-insensitive partial match)
            ->when($request->name, function ($query, $name) {
                $query->where('name', 'like', '%' . $name . '%');
            })
            // Filter by category_id (exact match)
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            // Filter by manufacturer_id (exact match)
            ->when($request->manufacturer_id, function ($query, $manufacturerId) {
                $query->where('manufacturer_id', $manufacturerId);
            })
            ->paginate($perPage);

        return VehicleResource::collection($vehicles);
    }

    /**
     * Store a newly created resource in storage.
     * TODO: turn into transaction
     */
    public function store(StoreVehicleRequest $request, VehicleService $vehicleService)
    {
        $data = $request->validated();

        $vehicle = $vehicleService->createVehicle($data, $request->file('img'));

        return new VehicleResource($vehicle);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehicle $vehicle)
    {
        $vehicle->load(['category', 'manufacturer']);
        return new VehicleResource($vehicle);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle, VehicleService $vehicleService)
    {
        $data = $request->validated();

        $vehicle = $vehicleService->updateVehicle($vehicle, $data, $request->file('img'));

        return new VehicleResource($vehicle);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle, VehicleService $vehicleService)
    {
        Gate::authorize('delete', $vehicle);

        $vehicleService->deleteVehicle($vehicle);

        return response()->noContent();
    }
}
