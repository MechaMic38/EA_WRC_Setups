<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\Resources\Json\ResourceCollection;

class VehicleController extends Controller
{
    private $folder = 'vehicles';

    /**
     * Display a listing of the resource.
     */
    public function index(): ResourceCollection
    {
        $vehicles = Vehicle::paginate(15);
        return VehicleResource::collection($vehicles);
    }

    /**
     * Store a newly created resource in storage.
     * TODO: turn into transaction
     */
    public function store(StoreVehicleRequest $request)
    {
        $validated = $request->validated();

        // Create a new vehicle record
        $vehicle = new Vehicle();
        $vehicle->name = $validated['name'];
        $vehicle->manufacturer_id = $validated['manufacturer_id'];
        $vehicle->category_id = $validated['category_id'];

        // Save the vehicle record
        $vehicle->save();

        // Save the vehicle image
        $img = $request->file('img');
        $imgPath = $img->storeAs(
            $this->folder,
            $vehicle->id . '.' . $img->extension(),
            'public'
        );

        // Update the vehicle record with the image path
        $vehicle->update([
            'img_path' => $imgPath,
        ]);

        return new VehicleResource($vehicle);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $vehicle)
    {
        $vehicle = Vehicle::with(['manufacturer', 'category'])->find($vehicle);

        if (!$vehicle) {
            return response()->json(['error' => 'Vehicle not found.'], 404);
        }

        return new VehicleResource($vehicle);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle)
    {
        $data = $request->validated();

        // Check if the user uploaded a new image
        if ($request->hasFile('img')) {
            // Remove the old image
            if ($vehicle->img_path) {
                $this->deleteImage($vehicle->img_path);
            }

            // Save the new image
            $img = $request->file('img');
            $imgPath = $img->storeAs(
                $this->folder,
                $vehicle->id . '.' . $img->extension(),
                'public'
            );
            $vehicle->img_path = $imgPath;
        }

        // Update the vehicle with the new data
        $vehicle->update($data);

        return new VehicleResource($vehicle);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        // TODO: add gate policy to check if user can delete vehicle

        // Delete the vehicle image if it exists
        if ($vehicle->img_path) {
            $this->deleteImage($vehicle->img_path);
        }

        // Delete the vehicle record
        $vehicle->delete();
    }
}
