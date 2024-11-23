<?php

namespace App\Http\Resources;

use App\Models\Category;
use App\Models\Manufacturer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class VehicleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'manufacturer' => new ManufacturerResource(
                Manufacturer::find($this->manufacturer_id)
            ),
            'category' => new CategoryResource(
                Category::find($this->category_id)
            ),
            'img_path' => URL::asset('storage' . '/' . $this->img_path)
        ];
    }
}
