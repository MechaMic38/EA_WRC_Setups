<?php

namespace App\Validation;

use Illuminate\Validation\Validator;

class ValidateSetupOptions
{
    public function __invoke(Validator $validator)
    {
        $data = $validator->validated();
        $providedOptions = $data['setup_options'];

        // Retrive the setup options from the configuration file
        $options = config('setup-options');
        $validOptions = collect($options)
            ->flatMap(fn($group) => array_keys($group))
            ->toArray();

        // Check if the provided options are valid
        foreach ($providedOptions as $option) {
            if (! in_array($option, $validOptions)) {
                $validator->errors()->add('setup_options', 'Invalid setup option: ' . $option);
            }
        }
    }
}
