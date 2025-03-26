<?php

namespace App\Http\Requests\Setups;

use App\Validation\ValidateSetupConfiguration;
use App\Validation\ValidateSetupLocationData;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateSetupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return Gate::authorize('update', $this->route('setup'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'surface_condition' => ['sometimes', 'string'],
            'season' => ['sometimes', 'string'],
            'tyres' => ['sometimes', 'string'],
            // Configuration
            'configuration' => ['sometimes', 'array'],
            'configuration.alignment' => ['required_with:configuration', 'array'],
            'configuration.alignment.*' => ['required_with:configuration', 'numeric'],
            'configuration.braking' => ['required_with:configuration', 'array'],
            'configuration.braking.*' => ['required_with:configuration', 'numeric'],
            'configuration.differentials' => ['required_with:configuration', 'array'],
            'configuration.differentials.*' => ['required_with:configuration', 'numeric'],
            'configuration.gears' => ['required_with:configuration', 'array'],
            'configuration.gears.*' => ['required_with:configuration', 'numeric'],
            'configuration.damping' => ['required_with:configuration', 'array'],
            'configuration.damping.*' => ['required_with:configuration', 'numeric'],
            'configuration.springs' => ['required_with:configuration', 'array'],
            'configuration.springs.*' => ['required_with:configuration', 'numeric'],
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     */
    public function after(): array
    {
        $setup = $this->route('setup');

        $validators = [
            new ValidateSetupLocationData($setup->location)
        ];

        if ($this->has('configuration')) {
            $validators[] = new ValidateSetupConfiguration($setup->vehicle);
        }

        return $validators;
    }
}
