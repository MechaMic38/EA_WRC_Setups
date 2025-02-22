<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVehicleRequest extends FormRequest
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
            'name' => 'sometimes|string|max:255',
            'manufacturer_id' => 'sometimes|string|exists:manufacturers,id',
            'category_id' => 'sometimes|string|exists:categories,id',
            'img' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
