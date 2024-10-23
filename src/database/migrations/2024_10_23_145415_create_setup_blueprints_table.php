<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use MongoDB\Laravel\Schema\Blueprint;

return new class extends Migration
{
    protected $connection = 'mongodb';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('setup_blueprints', function (Blueprint $collection) {
            $collection->id();
            $collection->json('alignment');
            $collection->json('braking');
            $collection->json('differentials');
            $collection->json('gears');
            $collection->json('damping');
            $collection->json('springs');
            $collection->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setup_blueprints');
    }
};
