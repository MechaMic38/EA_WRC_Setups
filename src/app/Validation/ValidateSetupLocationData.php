<?php

namespace App\Validation;

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
        if (!in_array($data['season'], $this->location->seasons)) {
            $validator->errors()->add('season', 'The selected season is invalid for the selected location.');
        }

        if (!in_array($data['tyres'], $this->location->tyres)) {
            $validator->errors()->add('tyres', 'The selected tyres are invalid for the selected location.');
        }

        if (!in_array($data['surface_condition'], $this->location->surface_conditions)) {
            $validator->errors()->add('surface_condition', 'The selected surface condition is invalid for the selected location.');
        }
    }
}
