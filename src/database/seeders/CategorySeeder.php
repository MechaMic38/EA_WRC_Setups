<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class CategorySeeder extends Seeder
{
    private $collection = 'categories';
    private $folder = 'categories';
    private $fileName = 'categories.json';

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
            $category = Category::create($item);

            // Handle the image
            $imgAssetPath = $imageDirectory . '/' . $item['img_path'];

            if (File::exists($imgAssetPath)) {
                $imageName = $category->id . '.' . File::extension($imgAssetPath);
                $imgPath = Category::STORAGE_IMG_PATH . '/' . $imageName;
                Storage::disk('public')->put(
                    $imgPath,
                    File::get($imgAssetPath)
                );
            } else {
                $imgPath = null;
            }

            // Update the item with the image path
            $category->update([
                'img_path' => $imgPath,
            ]);
        }
    }
}
