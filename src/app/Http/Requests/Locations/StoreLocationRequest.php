<?php

namespace App\Http\Requests\Locations;

use App\Enums\SeasonEnum;
use App\Enums\SurfaceConditionEnum;
use App\Enums\SurfaceTypeEnum;
use App\Enums\TyresEnum;
use App\Models\Location;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\Enum;

class StoreLocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return Gate::authorize('create', Location::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|unique:locations|max:255',
            'description' => 'required|string',
            'seasons' => 'required|array',
            'seasons.*' => ['string', new Enum(SeasonEnum::class)],
            'tyres' => 'required|array',
            'tyres.*' => ['string', new Enum(TyresEnum::class)],
            'surface_conditions' => 'required|array',
            'surface_conditions.*' => ['string', new Enum(SurfaceConditionEnum::class)],
            'surface_type' => ['required', 'string', new Enum(SurfaceTypeEnum::class)],
            'img_banner' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'img_bg' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
