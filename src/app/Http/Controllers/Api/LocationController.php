<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Locations\StoreLocationRequest;
use App\Http\Requests\Locations\UpdateLocationRequest;
use App\Http\Resources\LocationResource;
use App\Http\Resources\LocationSummaryResource;
use App\Models\Location;
use App\Services\LocationService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Gate;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): ResourceCollection
    {
        $perPage = $request->input('per_page', 15);

        $locations = Location::query()
            // Filter by name (case-insensitive partial match)
            ->when($request->name, function ($query, $name) {
                $query->where('name', 'like', '%' . $name . '%');
            })
            // Filter by surface type (exact match)
            ->when($request->surface_type, function ($query, $surfaceType) {
                $query->where('surface_type', $surfaceType);
            })
            ->paginate($perPage);

        return LocationSummaryResource::collection($locations);
    }

    /**
     * Store a newly created resource in storage.
     * TODO: turn into transaction
     */
    public function store(StoreLocationRequest $request, LocationService $locationService)
    {
        $data = $request->validated();

        $location = $locationService->createLocation(
            $data,
            $request->file('img_banner'),
            $request->file('img_bg')
        );

        return new LocationResource($location);
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location)
    {
        return new LocationResource($location);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLocationRequest $request, Location $location, LocationService $locationService)
    {
        $data = $request->validated();

        $location = $locationService->updateLocation(
            $location,
            $data,
            $request->file('img_banner'),
            $request->file('img_bg')
        );

        return new LocationResource($location);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location, LocationService $locationService)
    {
        Gate::authorize('delete', $location);

        $locationService->deleteLocation($location);

        return response()->noContent();
    }
}
