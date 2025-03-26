<?php

namespace App\Services;

use App\Models\SetupBlueprint;
use App\Models\Vehicle;

class VehicleService extends Service
{
    /**
     * Create a new vehicle.
     *
     * @param array $data
     * @param \Illuminate\Http\UploadedFile $img
     * @return \App\Models\Vehicle
     */
    public function createVehicle(array $data, $img): Vehicle
    {
        // Create a new vehicle record
        $vehicle = Vehicle::create($data);

        // Save the uploaded image
        $imgPath = $img->storeAs(
            Vehicle::STORAGE_IMG_PATH,
            $vehicle->id . '.' . $img->extension(),
            'public'
        );

        // Update the vehicle record with the image path
        $vehicle->update([
            'img_path' => $imgPath,
        ]);

        // Create a new setup blueprint for the vehicle, using the given setup options
        $this->createVehicleSetupBlueprint($vehicle, $data['setup_options']);

        return $vehicle;
    }

    /**
     * Update a vehicle.
     *
     * @param \App\Models\Vehicle $vehicle
     * @param array $data
     * @param \Illuminate\Http\UploadedFile|null $img
     * @return \App\Models\Vehicle
     */
    public function updateVehicle(Vehicle $vehicle, array $data, $img = null): Vehicle
    {
        // Check if the user uploaded a new image
        if ($img) {
            // Remove the old image
            if ($vehicle->img_path) {
                $this->deleteImageFromStorage($vehicle->img_path);
            }

            // Save the new image
            $imgPath = $img->storeAs(
                Vehicle::STORAGE_IMG_PATH,
                $vehicle->id . '.' . $img->extension(),
                'public'
            );
            $data['img_path'] = $imgPath;
        }

        // Update the vehicle record
        $vehicle->update($data);

        return $vehicle;
    }

    /**
     * Delete a vehicle.
     *
     * @param \App\Models\Vehicle $vehicle
     */
    public function deleteVehicle(Vehicle $vehicle): void
    {
        // Remove the vehicle image
        if ($vehicle->img_path) {
            $this->deleteImageFromStorage($vehicle->img_path);
        }

        // Remove the vehicle setup blueprint
        $vehicle->setupBlueprint->delete();

        // Remove the vehicle record
        $vehicle->delete();
    }

    /**
     * Update the setup blueprint for the specified vehicle.
     *
     * @param \App\Models\Vehicle $vehicle
     * @param array $data
     * @return \App\Models\SetupBlueprint
     */
    public function updateVehicleSetupBlueprint(Vehicle $vehicle, array $data): SetupBlueprint
    {
        // Update the vehicle's setup blueprint
        $vehicle->setupBlueprint->update($data);

        return $vehicle->setupBlueprint;
    }

    /**
     * Create a new vehicle setup blueprint for the given vehicle.
     *
     * @param \App\Models\Vehicle $vehicle
     * @param array $providedOptions
     */
    private function createVehicleSetupBlueprint(Vehicle $vehicle, array $providedOptions)
    {
        // Load the setup options
        $options = config('setup-options');

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

        // Create the setup blueprint record
        $vehicle->setupBlueprint()->create($data);
    }
}
