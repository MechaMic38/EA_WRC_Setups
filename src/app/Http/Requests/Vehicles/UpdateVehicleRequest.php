<?php

namespace App\Http\Requests\Vehicles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateVehicleRequest extends FormRequest
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
            'name' => 'sometimes|string|max:255',
            'manufacturer_id' => 'sometimes|string|exists:manufacturers,id',
            'category_id' => 'sometimes|string|exists:categories,id',
            'img' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
