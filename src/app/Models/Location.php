<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Location extends Model
{
    protected $table = 'locations';

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
}
