<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SetupResource extends JsonResource
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
            'surfaceCondition' => $this->surface_condition,
            'season' => $this->season,
            'tyres' => $this->tyres,
            'createdAt' => Carbon::parse($this->created_at)->toDateTimeLocalString(),
            'user' => $this->whenLoaded('user', function () {
                return new UserResource($this->user);
            }),
            'location' => $this->whenLoaded('location', function () {
                return new LocationSummaryResource($this->location);
            }),
            'vehicle' => $this->whenLoaded('vehicle', function () {
                return new VehicleResource($this->vehicle);
            }),
            'configuration' => $this->whenLoaded('configuration', function () {
                return new SetupConfigurationResource($this->configuration);
            }),
            'permissions' => [
                'update' => $request->user() ? $request->user()->can('update', $this->resource) : false,
                'delete' => $request->user() ? $request->user()->can('delete', $this->resource) : false,
            ]
        ];
    }
}
