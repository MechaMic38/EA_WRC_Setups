<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;

class Manufacturer extends Model
{
    protected $table = 'manufacturers';

    protected $fillable = [
        'name',
        'img_path'
    ];

    /**
     * Get the vehicles associated with the manufacturer.
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }
}
