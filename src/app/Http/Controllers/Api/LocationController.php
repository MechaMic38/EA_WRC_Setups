<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLocationRequest;
use App\Http\Requests\UpdateLocationRequest;
use App\Http\Resources\LocationResource;
use App\Http\Resources\LocationSummaryResource;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class LocationController extends Controller
{
    private $bannerFolder = 'locations_banner';
    private $bgFolder = 'locations_bg';

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): ResourceCollection
    {
        $locations = Location::query()
            // Filter by name (case-insensitive partial match)
            ->when($request->name, function ($query, $name) {
                $query->where('name', 'like', '%' . $name . '%');
            })
            // Filter by surface type (exact match)
            ->when($request->surface_type, function ($query, $surfaceType) {
                $query->where('surface_type', $surfaceType);
            })
            ->paginate(15);

        return LocationSummaryResource::collection($locations);
    }

    /**
     * Store a newly created resource in storage.
     * TODO: turn into transaction
     */
    public function store(StoreLocationRequest $request)
    {
        $validated = $request->validated();

        // Create a new location record
        $location = new Location();
        $location->name = $validated['name'];
        $location->description = $validated['description'];
        $location->seasons = $validated['seasons'];
        $location->tyres = $validated['tyres'];
        $location->surface_conditions = $validated['surface_conditions'];
        $location->surface_type = $validated['surface_type'];

        // Save the location record
        $location->save();

        // Save the uploaded images
        $imgBanner = $request->file('img_banner');
        $imgBannerPath = $imgBanner->storeAs(
            $this->bannerFolder,
            $location->id . '.' . $imgBanner->extension(),
            'public'
        );

        $imgBg = $request->file('img_bg');
        $imgBgPath = $imgBg->storeAs(
            $this->bgFolder,
            $location->id . '.' . $imgBg->extension(),
            'public'
        );

        // Update the location record with the image paths
        $location->update([
            'img_banner_path' => $imgBannerPath,
            'img_bg_path' => $imgBgPath,
        ]);

        return new LocationResource($location);
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location)
    {
        return new LocationResource($location);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLocationRequest $request, Location $location)
    {
        $data = $request->validated();

        // Check if the user has uploaded new images
        if ($request->hasFile('img_banner')) {
            // Remove the old image
            if ($location->img_banner_path) {
                $this->deleteImage($location->img_banner_path);
            }

            $imgBanner = $request->file('img_banner');
            $imgBannerPath = $imgBanner->storeAs(
                $this->bannerFolder,
                $location->id . '.' . $imgBanner->extension(),
                'public'
            );
            $data['img_banner_path'] = $imgBannerPath;
        }

        if ($request->hasFile('img_bg')) {
            // Remove the old image
            if ($location->img_bg_path) {
                $this->deleteImage($location->img_bg_path);
            }

            $imgBg = $request->file('img_bg');
            $imgBgPath = $imgBg->storeAs(
                $this->bgFolder,
                $location->id . '.' . $imgBg->extension(),
                'public'
            );
            $data['img_bg_path'] = $imgBgPath;
        }

        // Update the location with the new data
        $location->update($data);

        return new LocationResource($location);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        // TODO: add gate policy to check if user can delete location

        // Delete banner image if it exists
        if ($location->img_banner_path) {
            $this->deleteImage($location->img_banner_path);
        }

        // Delete background image if it exists
        if ($location->img_bg_path) {
            $this->deleteImage($location->img_bg_path);
        }

        // Delete the location record
        $location->delete();
    }
}
