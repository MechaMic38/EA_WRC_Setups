<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class VehicleResource extends JsonResource
{
    public static $wrap = false;

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
            'manufacturer' => $this->whenLoaded('manufacturer', function () {
                return new ManufacturerResource($this->manufacturer);
            }),
            'category' => $this->whenLoaded('category', function () {
                return new CategoryResource($this->category);
            }),
            'imgPath' => URL::asset('storage' . '/' . $this->img_path)
        ];
    }
}
