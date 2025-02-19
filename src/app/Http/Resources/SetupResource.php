<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SetupResource extends JsonResource
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
            'surface_condition' => $this->surface_condition,
            'season' => $this->season,
            'tyres' => $this->tyres,
            'user' => new UserResource($this->user),
            'location' => new LocationResource($this->location),
            'vehicle' => new VehicleResource($this->vehicle)
        ];
    }
}
