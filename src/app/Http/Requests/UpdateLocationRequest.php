<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: add gate policy to check if user is admin
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|unique:locations|max:255',
            'description' => 'sometimes|string',
            'seasons' => 'sometimes|array',
            'seasons.*' => 'string',
            'tyres' => 'sometimes|array',
            'tyres.*' => 'string',
            'surface_conditions' => 'sometimes|array',
            'surface_conditions.*' => 'string',
            'surface_type' => 'sometimes|string',
            'img_banner' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',
            'img_bg' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
