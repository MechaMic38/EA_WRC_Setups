<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SetupWithConfigResource extends JsonResource
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
            'surface_condition' => $this->surface_condition,
            'season' => $this->season,
            'tyres' => $this->tyres,
            'user' => new UserResource($this->user),
            'location' => new LocationSummaryResource($this->location),
            'vehicle' => new VehicleResource($this->vehicle),
            'configuration' => new SetupConfigurationResource($this->configuration)
        ];
    }
}
