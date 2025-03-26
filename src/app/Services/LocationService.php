<?php

namespace App\Services;

use App\Models\Location;

class LocationService extends Service
{
    /**
     * Create a new location.
     *
     * @param array $data
     * @param \Illuminate\Http\UploadedFile $bannerImg
     * @param \Illuminate\Http\UploadedFile $bgImg
     * @return \App\Models\Location
     */
    public function createLocation(array $data, $bannerImg, $bgImg): Location
    {
        // Create a new location record
        $location = Location::create($data);

        // Save the uploaded images
        $bannerImgPath = $bannerImg->storeAs(
            Location::STORAGE_IMG_BANNER_PATH,
            $location->id . '.' . $bannerImg->extension(),
            'public'
        );
        $bgImgPath = $bgImg->storeAs(
            Location::STORAGE_IMG_BG_PATH,
            $location->id . '.' . $bgImg->extension(),
            'public'
        );

        // Update the location record with the image paths
        $location->update([
            'img_banner_path' => $bannerImgPath,
            'img_bg_path' => $bgImgPath,
        ]);

        return $location;
    }

    /**
     * Update a location.
     *
     * @param \App\Models\Location $location
     * @param array $data
     * @param \Illuminate\Http\UploadedFile|null $bannerImg
     * @param \Illuminate\Http\UploadedFile|null $bgImg
     * @return \App\Models\Location
     */
    public function updateLocation(Location $location, array $data, $bannerImg = null, $bgImg = null): Location
    {
        // Check if the user has uploaded new images
        if ($bannerImg) {
            // Remove the old image
            if ($location->img_banner_path) {
                $this->deleteImageFromStorage($location->img_banner_path);
            }

            $bannerImgPath = $bannerImg->storeAs(
                Location::STORAGE_IMG_BANNER_PATH,
                $location->id . '.' . $bannerImg->extension(),
                'public'
            );
            $data['img_banner_path'] = $bannerImgPath;
        }

        if ($bgImg) {
            // Remove the old image
            if ($location->img_bg_path) {
                $this->deleteImageFromStorage($location->img_bg_path);
            }

            $bgImgPath = $bgImg->storeAs(
                Location::STORAGE_IMG_BG_PATH,
                $location->id . '.' . $bgImg->extension(),
                'public'
            );
            $data['img_bg_path'] = $bgImgPath;
        }

        // Update with the new data
        $location->update($data);

        return $location;
    }

    /**
     * Delete a location.
     *
     * @param \App\Models\Location $location
     */
    public function deleteLocation(Location $location): void
    {
        // Remove the images
        if ($location->img_banner_path) {
            $this->deleteImageFromStorage($location->img_banner_path);
        }
        if ($location->img_bg_path) {
            $this->deleteImageFromStorage($location->img_bg_path);
        }

        // Delete the location
        $location->delete();
    }
}
