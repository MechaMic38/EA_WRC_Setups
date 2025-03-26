<?php

namespace Database\Seeders;

use App\Models\Manufacturer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ManufacturerSeeder extends Seeder
{
    private $collection = 'manufacturers';
    private $folder = 'manufacturers';
    private $fileName = 'manufacturers.json';

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

            // Insert the item into the database
            $manufacturer = Manufacturer::create($item);

            // Handle the image
            $imgAssetPath = $imageDirectory . '/' . $item['img_path'];

            if (File::exists($imgAssetPath)) {
                $imageName = $manufacturer->id . '.' . File::extension($imgAssetPath);
                $imgPath = Manufacturer::STORAGE_IMG_PATH . '/' . $imageName;
                Storage::disk('public')->put(
                    $imgPath,
                    File::get($imgAssetPath)
                );
            } else {
                $imgPath = null;
            }

            // Update the item with the image path
            $manufacturer->update([
                'img_path' => $imgPath,
            ]);
        }
    }
}
