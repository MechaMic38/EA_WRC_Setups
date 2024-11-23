<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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
            // Handle the image
            $imgPath = $item['img_path'];
            $imagePath = $imageDirectory . '/' . $imgPath;

            if (File::exists($imagePath)) {
                $imageName = $item['_id'] . '.' . File::extension($imgPath);
                Storage::disk('public')->put($this->folder . '/' . $imageName, File::get($imagePath));
                $item['img_path'] = $this->folder . '/' . $imageName;
            } else {
                $item['img_path'] = null;
            }

            $timestamp = now();
            $item['updated_at'] = $timestamp;
            $item['created_at'] = $timestamp;

            // Cast IDs to strings
            $item['_id'] = (string) $item['_id'];

            // Insert the item into the database
            DB::table($this->collection)->insertGetId($item);
        }
    }
}
