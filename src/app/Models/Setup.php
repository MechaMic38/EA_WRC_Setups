<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;
use MongoDB\Laravel\Relations\HasOne;

class Setup extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'setups';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'surface_condition',
        'season',
        'tyres',
        'location_id',
        'vehicle_id',
        'config_id',
        'user_id',
    ];

    /**
     * Get the user that created the setup.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the location associated with the setup.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the vehicle associated with the setup.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get the setup configuration associated with the setup.
     */
    public function configuration(): HasOne
    {
        return $this->hasOne(SetupConfiguration::class, '_id', '_id');
    }
}
