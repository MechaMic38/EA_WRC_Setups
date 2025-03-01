<?php

namespace App\Validation;

use App\Models\SetupBlueprint;
use App\Models\Vehicle;
use Illuminate\Validation\Validator;

class ValidateSetupBlueprint
{
    protected $vehicle;

    public function __construct(Vehicle $vehicle)
    {
        $this->vehicle = $vehicle;
    }

    public function __invoke(Validator $validator)
    {
        $data = $validator->validated();
        $blueprint = $this->vehicle->setupBlueprint;

        // Check if the vehicle has a setup blueprint
        if (!$blueprint) {
            $validator->errors()->add('vehicle', 'Setup blueprint not found.');
        }

        $this->validateRequiredFields($validator, $blueprint, $data);
        $this->validateNoExtraFields($validator, $blueprint, $data);
    }

    /**
     * Validate the required fields of the given blueprint, compared to the original blueprint.
     *
     * @param Validator $validator
     * @param SetupBlueprint $blueprint
     * @param array $data
     */
    private function validateRequiredFields(Validator $validator, SetupBlueprint $blueprint, array $data)
    {
        foreach (SetupBlueprint::GROUPS as $group) {
            foreach ($blueprint[$group] as $field => $rules) {
                // Check if the field exists in the data
                if (! array_key_exists($field, $data[$group])) {
                    $validator->errors()->add($field, 'This field is required.');
                    continue;
                }

                // Check if the field rules are valid
                $default = $rules['default_value'];
                $min = $rules['min_value'];
                $max = $rules['max_value'];
                if ($min >= $max) {
                    $validator->errors()->add($field, 'The minimum value must be less than the maximum value.');
                } else if ($default < $min || $default > $max) {
                    $validator->errors()->add($field, 'The default value must be between the given range.');
                }

                $steps = $rules['steps'];
                if ($steps <= 0) {
                    $validator->errors()->add($field, 'The steps must be greater than zero.');
                }
            }
        }
    }

    /**
     * Validate that no extra fields are present in the setup blueprint, compared to the original blueprint.
     *
     * @param Validator $validator
     * @param SetupBlueprint $blueprint
     * @param array $data
     */
    private function validateNoExtraFields(Validator $validator, SetupBlueprint $blueprint, array $data)
    {
        foreach (SetupBlueprint::GROUPS as $group) {
            foreach ($data[$group] as $field => $rules) {
                if (! array_key_exists($field, $blueprint[$group])) {
                    $validator->errors()->add($field, 'This field is not allowed.');
                }
            }
        }
    }
}
