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

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): ResourceCollection
    {
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
            ->paginate(15);

        return VehicleResource::collection($vehicles);
    }

    /**
     * Store a newly created resource in storage.
     * TODO: turn into transaction
     */
    public function store(StoreVehicleRequest $request, VehicleService $vehicleService)
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
            Vehicle::STORAGE_IMG_PATH,
            $vehicle->id . '.' . $img->extension(),
            'public'
        );

        // Update the vehicle record with the image path
        $vehicle->update([
            'img_path' => $imgPath,
        ]);

        // Create a new vehicle setup blueprint, using the given setup options
        $this->createVehicleSetupBlueprint($vehicle, $validated['setup_options']);

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

        // Check if the user uploaded a new image
        if ($request->hasFile('img')) {
            // Remove the old image
            if ($vehicle->img_path) {
                $this->deleteImage($vehicle->img_path);
            }

            // Save the new image
            $img = $request->file('img');
            $imgPath = $img->storeAs(
                Vehicle::STORAGE_IMG_PATH,
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
    public function destroy(Vehicle $vehicle, VehicleService $vehicleService)
    {
        // TODO: add gate policy to check if user can delete vehicle

        // Delete the vehicle image if it exists
        if ($vehicle->img_path) {
            $this->deleteImage($vehicle->img_path);
        }

        // Delete vehicle setup blueprint
        $vehicle->setupBlueprint->delete();

        // Delete the vehicle record
        $vehicle->delete();
    }

    /**
     * Create a new vehicle setup blueprint for the given vehicle.
     */
    private function createVehicleSetupBlueprint(Vehicle $vehicle, array $providedOptions)
    {
        // Load the setup options
        $options = config('setup-options');

        // Create a new setup blueprint record
        $blueprint = new SetupBlueprint();

        // Create base data array, using the setup blueprint groups as keys
        $data = [];
        foreach (SetupBlueprint::GROUPS as $group) {
            $data[$group] = [];
        }

        // Retrieve option rules;
        foreach ($providedOptions as $option) {
            foreach ($options as $group => $rules) {
                if (array_key_exists($option, $rules)) {
                    $data[$group][$option] = [
                        'min_value' => $rules[$option]['min_value'],
                        'max_value' => $rules[$option]['max_value'],
                        'default_value' => $rules[$option]['default_value'],
                        'steps' => $rules[$option]['steps'],
                    ];
                    break;
                }
            }
        }

        // Set blueprint ID as vehicle ID
        $blueprint['_id'] = $vehicle->id;
        $blueprint->fill($data);
        $blueprint->save();
    }
}
