<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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
            // Handle banner image
            $imgPath = $item['img_banner_path'];
            $imagePath = $bannerImageDirectory . '/' . $imgPath;

            if (File::exists($imagePath)) {
                $imageName = $item['_id'] . '.' . File::extension($imgPath);
                Storage::disk('public')->put($this->bannerFolder . '/' . $imageName, File::get($imagePath));
                $item['img_banner_path'] = $this->bannerFolder . '/' . $imageName;
            } else {
                $item['img_banner_path'] = null;
            }

            // Handle background image
            $imgPath = $item['img_bg_path'];
            $imagePath = $bgImageDirectory . '/' . $imgPath;

            if (File::exists($imagePath)) {
                $imageName = $item['_id'] . '.' . File::extension($imgPath);
                Storage::disk('public')->put($this->bgFolder . '/' . $imageName, File::get($imagePath));
                $item['img_bg_path'] = $this->bgFolder . '/' . $imageName;
            } else {
                $item['img_bg_path'] = null;
            }

            $timestamp = now();
            $item['updated_at'] = $timestamp;
            $item['created_at'] = $timestamp;

            // Cast IDs to strings
            $item['_id'] = (string) $item['_id'];

            // Insert the item into the database
            DB::table($this->collection)->insert($item);
        }
    }
}
