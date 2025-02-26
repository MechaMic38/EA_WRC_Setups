<?php

namespace App\Validation;

use App\Models\SetupBlueprint;
use App\Models\Vehicle;
use Illuminate\Validation\Validator;

class ValidateSetupConfiguration
{
    private $groups = [
        'alignment',
        'braking',
        'differentials',
        'gears',
        'damping',
        'springs',
    ];

    public function __invoke(Validator $validator)
    {
        $data = $validator->validated();

        // Retrieve the vehicle setup blueprint
        $vehicle = Vehicle::find($data['vehicle_id']);
        $blueprint = $vehicle->setupBlueprint;

        // Validate the setup configuration against the blueprint
        $this->validateRequiredFields($validator, $blueprint, $data['configuration']);
        $this->validateNoExtraFields($validator, $blueprint, $data['configuration']);
    }

    /**
     * Validate the required fields of the setup configuration.
     *
     * @param Validator $validator
     * @param SetupBlueprint $blueprint
     * @param array $configuration
     */
    private function validateRequiredFields(Validator $validator, SetupBlueprint $blueprint, array $configuration)
    {
        foreach ($this->groups as $group) {
            foreach ($blueprint[$group] as $field => $rules) {
                // Check if the field exists in the configuration
                if (! array_key_exists($field, $configuration[$group])) {
                    $validator->errors()->add($field, 'This field is required.');
                    continue;
                }

                // Check if the field value is within the allowed range
                $value = $configuration[$group][$field];
                $min = $rules['min_value'];
                $max = $rules['max_value'];
                if ($value < $min || $value > $max) {
                    $validator->errors()->add($field, 'This field must be between ' . $min . ' and ' . $max . '.');
                }
            }
        }
    }

    /**
     * Validate that no extra fields are present in the setup configuration.
     *
     * @param Validator $validator
     * @param SetupBlueprint $blueprint
     * @param array $configuration
     */
    private function validateNoExtraFields(Validator $validator, SetupBlueprint $blueprint, array $configuration)
    {
        foreach ($this->groups as $group) {
            foreach ($configuration[$group] as $field => $value) {
                if (! array_key_exists($field, $blueprint[$group])) {
                    $validator->errors()->add($field, 'This field is not allowed.');
                }
            }
        }
    }
}
