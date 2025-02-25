<?php

namespace App\Http\Requests;

use App\Models\Setup;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreSetupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return Gate::authorize('create', Setup::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'surface_condition' => ['required', 'string'],
            'season' => ['required', 'string'],
            'tyres' => ['required', 'string'],
            // Relationships
            'location_id' => ['required', 'string', 'exists:locations,id'],
            'vehicle_id' => ['required', 'string', 'exists:vehicles,id'],
            // Configuration
            'configuration' => ['required', 'array'],
            'configuration.alignment' => ['required', 'array'],
            'configuration.alignment.*' => ['required', 'numeric'],
            'configuration.braking' => ['required', 'array'],
            'configuration.braking.*' => ['required', 'numeric'],
            'configuration.differentials' => ['required', 'array'],
            'configuration.differentials.*' => ['required', 'numeric'],
            'configuration.gears' => ['required', 'array'],
            'configuration.gears.*' => ['required', 'numeric'],
            'configuration.damping' => ['required', 'array'],
            'configuration.damping.*' => ['required', 'numeric'],
            'configuration.springs' => ['required', 'array'],
            'configuration.springs.*' => ['required', 'numeric'],
        ];
    }
}
