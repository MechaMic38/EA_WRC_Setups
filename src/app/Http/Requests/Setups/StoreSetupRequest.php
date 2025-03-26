<?php

namespace App\Http\Requests\Setups;

use App\Enums\SeasonEnum;
use App\Enums\SurfaceConditionEnum;
use App\Enums\TyresEnum;
use App\Models\Location;
use App\Models\Setup;
use App\Models\Vehicle;
use App\Validation\ValidateSetupConfiguration;
use App\Validation\ValidateSetupLocationData;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\Enum;

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
            'surface_condition' => ['required', 'string', new Enum(SurfaceConditionEnum::class)],
            'season' => ['required', 'string', new Enum(SeasonEnum::class)],
            'tyres' => ['required', 'string', new Enum(TyresEnum::class)],
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

    /**
     * Get the "after" validation callables for the request.
     */
    public function after(): array
    {
        $location = Location::find($this->input('location_id'));
        $vehicle = Vehicle::find($this->input('vehicle_id'));

        // Check if the location and vehicle exist
        if (is_null($location) || is_null($vehicle)) {
            return [];
        }

        return [
            new ValidateSetupLocationData($location),
            new ValidateSetupConfiguration($vehicle),
        ];
    }
}
