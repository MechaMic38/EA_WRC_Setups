<?php

namespace App\Http\Requests\Locations;

use App\Enums\SeasonEnum;
use App\Enums\SurfaceConditionEnum;
use App\Enums\SurfaceTypeEnum;
use App\Enums\TyresEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateLocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return Gate::authorize('update', $this->route('location'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('locations')->ignore($this->route('location'))
            ],
            'description' => 'sometimes|string',
            'seasons' => 'sometimes|array',
            'seasons.*' => ['string', new Enum(SeasonEnum::class)],
            'tyres' => 'sometimes|array',
            'tyres.*' => ['string', new Enum(TyresEnum::class)],
            'surface_conditions' => 'sometimes|array',
            'surface_conditions.*' => ['string', new Enum(SurfaceConditionEnum::class)],
            'surface_type' => ['sometimes', 'string', new Enum(SurfaceTypeEnum::class)],
            'img_banner' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',
            'img_bg' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
