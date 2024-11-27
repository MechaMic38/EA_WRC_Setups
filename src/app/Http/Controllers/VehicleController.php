<?php

namespace App\Http\Controllers;

use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $paginated = Vehicle::paginate(15);

        return Inertia::render('Dashboard/Vehicles', [
            'vehicles' => VehicleResource::collection($paginated)
        ]);
    }

    public function indexApi(): ResourceCollection
    {
        $vehicles = Vehicle::all();
        return VehicleResource::collection($vehicles);
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
    public function show(Vehicle $vehicle)
    {
        //
    }

    public function showApi(string $vehicle): VehicleResource
    {
        $vehicle = Vehicle::with(['manufacturer', 'category'])->find($vehicle);

        if (!$vehicle) {
            return response()->json(['error' => 'Vehicle not found.'], 404);
        }

        return new VehicleResource($vehicle);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vehicle $vehicle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        //
    }
}
