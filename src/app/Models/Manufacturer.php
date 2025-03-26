<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;

class Manufacturer extends Model
{
    /**
     * The path to the storage folder for manufacturer images.
     */
    public const STORAGE_IMG_PATH = 'images/manufacturers';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'manufacturers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
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
