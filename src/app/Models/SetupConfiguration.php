<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

class SetupConfiguration extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'setup_configurations';

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
     * Get the setup associated with the setup configuration.
     */
    public function setup(): BelongsTo
    {
        return $this->belongsTo(Setup::class, '_id');
    }
}
