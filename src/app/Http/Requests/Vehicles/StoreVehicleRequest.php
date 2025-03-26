<?php

namespace App\Http\Requests\Vehicles;

use App\Models\Vehicle;
use App\Validation\ValidateSetupOptions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreVehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return Gate::authorize('create', Vehicle::class);
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
            'setup_options' => 'required|array',
            'setup_options.*' => 'string',
            'manufacturer_id' => 'required|string|exists:manufacturers,id',
            'category_id' => 'required|string|exists:categories,id',
            'img' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     */
    public function after(): array
    {
        return [
            new ValidateSetupOptions,
        ];
    }
}
