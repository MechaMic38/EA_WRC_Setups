<?php

namespace App\Http\Requests\Vehicles;

use App\Validation\ValidateSetupBlueprint;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateVehicleBlueprintRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return Gate::authorize('update', $this->route('vehicle'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'alignment' => ['sometimes', 'array'],
            'alignment.*' => ['required_with:alignment', 'array'],
            'alignment.*.min_value' => ['required_with:alignment.*', 'numeric'],
            'alignment.*.max_value' => ['required_with:alignment.*', 'numeric'],
            'alignment.*.default_value' => ['required_with:alignment.*', 'numeric'],
            'alignment.*.steps' => ['required_with:alignment.*', 'numeric'],
            'braking' => ['sometimes', 'array'],
            'braking.*' => ['required_with:braking', 'array'],
            'braking.*.min_value' => ['required_with:braking.*', 'numeric'],
            'braking.*.max_value' => ['required_with:braking.*', 'numeric'],
            'braking.*.default_value' => ['required_with:braking.*', 'numeric'],
            'braking.*.steps' => ['required_with:braking.*', 'numeric'],
            'differentials' => ['sometimes', 'array'],
            'differentials.*' => ['required_with:differentials', 'array'],
            'differentials.*.min_value' => ['required_with:differentials.*', 'numeric'],
            'differentials.*.max_value' => ['required_with:differentials.*', 'numeric'],
            'differentials.*.default_value' => ['required_with:differentials.*', 'numeric'],
            'differentials.*.steps' => ['required_with:differentials.*', 'numeric'],
            'gears' => ['sometimes', 'array'],
            'gears.*' => ['required_with:gears', 'array'],
            'gears.*.min_value' => ['required_with:gears.*', 'numeric'],
            'gears.*.max_value' => ['required_with:gears.*', 'numeric'],
            'gears.*.default_value' => ['required_with:gears.*', 'numeric'],
            'gears.*.steps' => ['required_with:gears.*', 'numeric'],
            'damping' => ['sometimes', 'array'],
            'damping.*' => ['required_with:damping', 'array'],
            'damping.*.min_value' => ['required_with:damping.*', 'numeric'],
            'damping.*.max_value' => ['required_with:damping.*', 'numeric'],
            'damping.*.default_value' => ['required_with:damping.*', 'numeric'],
            'damping.*.steps' => ['required_with:damping.*', 'numeric'],
            'springs' => ['sometimes', 'array'],
            'springs.*' => ['required_with:springs', 'array'],
            'springs.*.min_value' => ['required_with:springs.*', 'numeric'],
            'springs.*.max_value' => ['required_with:springs.*', 'numeric'],
            'springs.*.default_value' => ['required_with:springs.*', 'numeric'],
            'springs.*.steps' => ['required_with:springs.*', 'numeric'],
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     */
    public function after(): array
    {
        $vehicle = $this->route('vehicle');

        return [
            new ValidateSetupBlueprint($vehicle),
        ];
    }
}
