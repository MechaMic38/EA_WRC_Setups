<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class VehicleSeeder extends Seeder
{
    private $collection = 'vehicles';
    private $folder = 'vehicles';
    private $fileName = 'vehicles.json';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Load from JSON file
        $jsonPath = database_path('seeders/assets/json' . '/' . $this->fileName);
        $json = File::get($jsonPath);
        $data = json_decode($json, true);

        // Directory where the images are stored
        $imageDirectory = database_path('seeders/assets/images' . '/' . $this->folder);

        // Process and insert data into the database
        foreach ($data as $item) {
            // Cast IDs to strings
            $item['_id'] = (string) $item['_id'];
            $item['category_id'] = (string) $item['category_id'];
            $item['manufacturer_id'] = (string) $item['manufacturer_id'];
            $item['setup_blueprint_id'] = (string) $item['setup_blueprint_id'];

            // Insert the item into the database
            $vehicle = Vehicle::create($item);

            // Handle the image
            $imgAssetPath = $imageDirectory . '/' . $item['img_path'];

            if (File::exists($imgAssetPath)) {
                $imageName = $vehicle->id . '.' . File::extension($imgAssetPath);
                $imgPath = Vehicle::STORAGE_IMG_PATH . '/' . $imageName;
                Storage::disk('public')->put(
                    $imgPath,
                    File::get($imgAssetPath)
                );
            } else {
                $imgPath = null;
            }

            // Update the item with the image path
            $vehicle->update([
                'img_path' => $imgPath,
            ]);
        }
    }
}
