<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class SetupBlueprintSeeder extends Seeder
{
    private $collection = 'setup_blueprints';
    private $fileName = 'setup_blueprints.json';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Load from JSON file
        $jsonPath = database_path('seeders/assets/json' . '/' . $this->fileName);
        $json = File::get($jsonPath);
        $data = json_decode($json, true);

        foreach ($data as $item) {
            $timestamp = now();
            $item['updated_at'] = $timestamp;
            $item['created_at'] = $timestamp;

            DB::table($this->collection)->insert($item);
        }
    }
}
