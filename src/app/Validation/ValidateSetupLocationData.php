<?php

namespace App\Validation;

use App\Enums\SeasonEnum;
use App\Enums\SurfaceConditionEnum;
use App\Enums\TyresEnum;
use App\Models\Location;
use Illuminate\Validation\Validator;

class ValidateSetupLocationData
{
    protected $location;

    public function __construct(Location $location)
    {
        $this->location = $location;
    }

    public function __invoke(Validator $validator)
    {
        $data = $validator->validated();

        // Validate setup location
        if (!$this->location->seasons->contains(
            SeasonEnum::from($data['season'])
        )) {
            $validator->errors()->add('season', 'The selected season is invalid for the selected location.');
        }

        if (!$this->location->tyres->contains(
            TyresEnum::from($data['tyres'])
        )) {
            $validator->errors()->add('tyres', 'The selected tyres are invalid for the selected location.');
        }

        if (!$this->location->surface_conditions->contains(
            SurfaceConditionEnum::from($data['surface_condition'])
        )) {
            $validator->errors()->add('surface_condition', 'The selected surface condition is invalid for the selected location.');
        }
    }
}
