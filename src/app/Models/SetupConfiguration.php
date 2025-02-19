<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

class SetupConfiguration extends Model
{
    protected $table = 'setup_configurations';

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
