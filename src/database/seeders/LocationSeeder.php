<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class LocationSeeder extends Seeder
{
    private $collection = 'locations';
    private $bannerFolder = 'locations_banner';
    private $bgFolder = 'locations_bg';
    private $fileName = 'locations.json';

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
        $bannerImageDirectory = database_path('seeders/assets/images' . '/' . $this->bannerFolder);
        $bgImageDirectory = database_path('seeders/assets/images' . '/' . $this->bgFolder);

        // Process and insert data into the database
        foreach ($data as $item) {
            // Lowercase all seasons, tyres, and surface conditions
            $item['seasons'] = array_map('strtolower', $item['seasons']);
            $item['tyres'] = array_map('strtolower', $item['tyres']);
            $item['surface_conditions'] = array_map('strtolower', $item['surface_conditions']);
            $item['surface_type'] = strtolower($item['surface_type']);

            // Cast IDs to strings
            $item['_id'] = (string) $item['_id'];

            // Insert the item into the database
            $location = Location::create($item);

            // Handle the banner image
            $imgAssetPath = $bannerImageDirectory . '/' . $item['img_banner_path'];

            if (File::exists($imgAssetPath)) {
                $imageName = $location->id . '.' . File::extension($imgAssetPath);
                $imgBannerPath = Location::STORAGE_IMG_BANNER_PATH . '/' . $imageName;
                Storage::disk('public')->put(
                    $imgBannerPath,
                    File::get($imgAssetPath)
                );
            } else {
                $imgBannerPath = null;
            }

            // Handle the background image
            $imgAssetPath = $bgImageDirectory . '/' . $item['img_bg_path'];

            if (File::exists($imgAssetPath)) {
                $imageName = $location->id . '.' . File::extension($imgAssetPath);
                $imgBgPath = Location::STORAGE_IMG_BG_PATH . '/' . $imageName;
                Storage::disk('public')->put(
                    $imgBgPath,
                    File::get($imgAssetPath)
                );
            } else {
                $imgBgPath = null;
            }

            // Update the item with the image paths
            $location->update([
                'img_banner_path' => $imgBannerPath,
                'img_bg_path' => $imgBgPath,
            ]);
        }
    }
}
