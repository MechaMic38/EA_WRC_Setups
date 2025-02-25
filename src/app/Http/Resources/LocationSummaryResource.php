<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class LocationSummaryResource extends JsonResource
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
            'description' => $this->description,
            'surface_type' => $this->surface_type,
            'img_banner_path' => URL::asset('storage' . '/' . $this->img_banner_path),
            'img_bg_path' => URL::asset('storage' . '/' . $this->img_bg_path)
        ];
    }
}
