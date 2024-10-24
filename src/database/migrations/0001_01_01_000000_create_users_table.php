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
        Schema::create('users', function (Blueprint $collection) {
            $collection->index('name');
            $collection->index('email');
        });

        Schema::create('password_reset_tokens', function (Blueprint $collection) {
            $collection->index('email');
        });

        Schema::create('sessions', function (Blueprint $collection) {
            $collection->index('user_id')->nullable();
            $collection->index('last_activity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
