<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class LocationResource extends JsonResource
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
            'description' => $this->description,
            'seasons' => $this->seasons,
            'tyres' => $this->tyres,
            'surface_conditions' => $this->surface_conditions,
            'surface_type' => $this->surface_type,
            'img_banner_path' => URL::asset('storage' . '/' . $this->img_banner_path),
            'img_bg_path' => URL::asset('storage' . '/' . $this->img_bg_path)
        ];
    }
}
