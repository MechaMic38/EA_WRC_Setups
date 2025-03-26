<?php

namespace App\Services;

use App\Models\Manufacturer;

class ManufacturerService extends Service
{
    /**
     * Create a new manufacturer.
     *
     * @param array $data
     * @param \Illuminate\Http\UploadedFile $img
     * @return \App\Models\Manufacturer
     */
    public function createManufacturer(array $data, $img): Manufacturer
    {
        // Create a new manufacturer record
        $manufacturer = Manufacturer::create($data);

        // Save the uploaded image
        $imgPath = $img->storeAs(
            Manufacturer::STORAGE_IMG_PATH,
            $manufacturer->id . '.' . $img->extension(),
            'public'
        );

        // Update the manufacturer record with the image path
        $manufacturer->update([
            'img_path' => $imgPath,
        ]);

        return $manufacturer;
    }

    /**
     * Update a manufacturer.
     *
     * @param \App\Models\Manufacturer $manufacturer
     * @param array $data
     * @param \Illuminate\Http\UploadedFile|null $img
     * @return \App\Models\Manufacturer
     */
    public function updateManufacturer(Manufacturer $manufacturer, array $data, $img = null): Manufacturer
    {
        // Check if the user uploaded a new image
        if ($img) {
            // Remove the old image
            if ($manufacturer->img_path) {
                $this->deleteImageFromStorage($manufacturer->img_path);
            }

            // Save the new image
            $imgPath = $img->storeAs(
                Manufacturer::STORAGE_IMG_PATH,
                $manufacturer->id . '.' . $img->extension(),
                'public'
            );
            $data['img_path'] = $imgPath;
        }

        // Update with the new data
        $manufacturer->update($data);

        return $manufacturer;
    }

    /**
     * Delete a manufacturer.
     *
     * @param \App\Models\Manufacturer $manufacturer
     * @return void
     */
    public function deleteManufacturer(Manufacturer $manufacturer): void
    {
        // Remove the image
        if ($manufacturer->img_path) {
            $this->deleteImageFromStorage($manufacturer->img_path);
        }

        // Delete the manufacturer
        $manufacturer->delete();
    }
}
