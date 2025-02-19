<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ManufacturerResource;
use App\Models\Manufacturer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ManufacturerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): ResourceCollection
    {
        $manufacturers = Manufacturer::paginate(15);
        return ManufacturerResource::collection($manufacturers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $manufacturer): ManufacturerResource
    {
        $manufacturer = Manufacturer::find($manufacturer);

        if (!$manufacturer) {
            return response()->json(['error' => 'Manufacturer not found.'], 404);
        }

        return new ManufacturerResource($manufacturer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Manufacturer $manufacturer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Manufacturer $manufacturer)
    {
        //
    }
}
