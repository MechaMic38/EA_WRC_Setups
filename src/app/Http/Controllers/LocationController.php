<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocationResource;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $paginated = Location::paginate(15);

        return Inertia::render('Dashboard/Locations', [
            'locations' => LocationResource::collection($paginated)
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function indexApi(): ResourceCollection
    {
        $locations = Location::all();
        return LocationResource::collection($locations);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location)
    {
        //
    }

    public function showApi(string $location): LocationResource
    {
        $location = Location::find($location);

        if (!$location) {
            return response()->json(['error' => 'Location not found.'], 404);
        }

        return new LocationResource($location);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Location $location)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        //
    }
}
