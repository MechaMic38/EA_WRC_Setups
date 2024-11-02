<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

class SetupBlueprint extends Model
{
    protected $table = 'setup_blueprints';

    protected $fillable = [
        'alignment',
        'braking',
        'differentials',
        'gears',
        'damping',
        'springs'
    ];

    /**
     * Get the vehicle associated with the setup blueprint.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, '_id');
    }
}
