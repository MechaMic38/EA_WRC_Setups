<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;
use MongoDB\Laravel\Relations\HasOne;

class Vehicle extends Model
{
    protected $table = 'vehicles';

    protected $fillable = [
        'name',
        'category_id',
        'manufacturer_id',
        'img_path'
    ];

    /**
     * Get the category that the vehicle belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the manufacturer that the vehicle belongs to.
     */
    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class);
    }

    /**
     * Get the setup blueprint associated with the vehicle.
     */
    public function setupBlueprint(): HasOne
    {
        return $this->hasOne(SetupBlueprint::class, '_id', '_id');
    }
}
