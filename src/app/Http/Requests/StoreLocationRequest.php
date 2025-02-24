<?php

namespace App\Http\Requests;

use App\Models\Location;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

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
            'seasons.*' => 'string',
            'tyres' => 'required|array',
            'tyres.*' => 'string',
            'surface_conditions' => 'required|array',
            'surface_conditions.*' => 'string',
            'surface_type' => 'required|string',
            'img_banner' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'img_bg' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
