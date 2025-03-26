<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

class SetupBlueprint extends Model
{
    /**
     * The groups of setup options.
     *
     * @var array<string>
     */
    public const GROUPS = [
        'alignment',
        'braking',
        'differentials',
        'gears',
        'damping',
        'springs',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'setup_blueprints';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
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
