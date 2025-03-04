<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreManufacturerRequest;
use App\Http\Requests\UpdateManufacturerRequest;
use App\Http\Resources\ManufacturerResource;
use App\Models\Manufacturer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ManufacturerController extends Controller
{
    private $folder = 'manufacturers';

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): ResourceCollection
    {
        $manufacturers = Manufacturer::query()
            // Filter by name (case-insensitive partial match)
            ->when($request->name, function ($query, $name) {
                $query->where('name', 'like', '%' . $name . '%');
            })
            ->paginate(15);

        return ManufacturerResource::collection($manufacturers);
    }

    /**
     * Store a newly created resource in storage.
     * TODO: turn into transaction
     */
    public function store(StoreManufacturerRequest $request)
    {
        $validated = $request->validated();

        // Create a new manufacturer record
        $manufacturer = new Manufacturer();
        $manufacturer->name = $validated['name'];

        // Save the manufacturer record
        $manufacturer->save();

        // Save the uploaded image
        $img = $request->file('img');
        $imgPath = $img->storeAs(
            $this->folder,
            $manufacturer->id . '.' . $img->extension(),
            'public'
        );

        // Update the manufacturer record with the image path
        $manufacturer->update([
            'img_path' => $imgPath,
        ]);

        return new ManufacturerResource($manufacturer);
    }

    /**
     * Display the specified resource.
     */
    public function show(Manufacturer $manufacturer)
    {
        return new ManufacturerResource($manufacturer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateManufacturerRequest $request, Manufacturer $manufacturer)
    {
        $data = $request->validated();

        // Check if the user uploaded a new image
        if ($request->hasFile('img')) {
            // Remove the old image
            if ($manufacturer->img_path) {
                $this->deleteImage($manufacturer->img_path);
            }

            // Save the new image
            $img = $request->file('img');
            $imgPath = $img->storeAs(
                $this->folder,
                $manufacturer->id . '.' . $img->extension(),
                'public'
            );
            $data['img_path'] = $imgPath;
        }

        // Update the manufacturer with the new data
        $manufacturer->update($data);

        return new ManufacturerResource($manufacturer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Manufacturer $manufacturer)
    {
        // TODO: add gate policy to check if user can delete manufacturer

        // Delete the manufacturer image if it exists
        if ($manufacturer->img_path) {
            $this->deleteImage($manufacturer->img_path);
        }

        // Delete the manufacturer record
        $manufacturer->delete();
    }
}
