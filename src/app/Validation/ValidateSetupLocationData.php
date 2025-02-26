<?php

namespace App\Validation;

use App\Models\Location;
use Illuminate\Validation\Validator;

class ValidateSetupLocationData
{
    public function __invoke(Validator $validator)
    {
        $data = $validator->validated();
        $location = Location::find($data['location_id']);

        // Validate setup location
        if (!in_array($data['season'], $location->seasons)) {
            $validator->errors()->add('season', 'The selected season is invalid for the selected location.');
        }

        if (!in_array($data['tyres'], $location->tyres)) {
            $validator->errors()->add('tyres', 'The selected tyres are invalid for the selected location.');
        }

        if (!in_array($data['surface_condition'], $location->surface_conditions)) {
            $validator->errors()->add('surface_condition', 'The selected surface condition is invalid for the selected location.');
        }
    }
}
