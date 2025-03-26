<?php

namespace App\Models;

use App\Enums\SeasonEnum;
use App\Enums\SurfaceConditionEnum;
use App\Enums\SurfaceTypeEnum;
use App\Enums\TyresEnum;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;
use MongoDB\Laravel\Eloquent\Model;

class Location extends Model
{
    /**
     * The path to the storage folder for location banner images.
     */
    public const STORAGE_IMG_BANNER_PATH = 'images/locations_banner';

    /**
     * The path to the storage folder for location background images.
     */
    public const STORAGE_IMG_BG_PATH = 'images/locations_bg';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'locations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'description',
        'seasons',
        'tyres',
        'surface_conditions',
        'surface_type',
        'img_banner_path',
        'img_bg_path'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'seasons' => AsEnumCollection::of(SeasonEnum::class),
            'tyres' => AsEnumCollection::of(TyresEnum::class),
            'surface_conditions' => AsEnumCollection::of(SurfaceConditionEnum::class),
            'surface_type' => SurfaceTypeEnum::class,
        ];
    }
}
