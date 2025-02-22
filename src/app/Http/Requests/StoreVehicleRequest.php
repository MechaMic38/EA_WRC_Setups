<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'manufacturer_id' => 'required|string|exists:manufacturers,id',
            'category_id' => 'required|string|exists:categories,id',
            'img' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
