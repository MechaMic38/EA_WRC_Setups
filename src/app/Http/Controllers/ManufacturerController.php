<?php

namespace App\Http\Controllers;

use App\Http\Resources\ManufacturerResource;
use App\Models\Manufacturer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Inertia\Inertia;

use function PHPSTORM_META\map;

class ManufacturerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Dashboard/Manufacturers', [
            'manufacturers' => Manufacturer::all()
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function indexApi(): ResourceCollection
    {
        $manufacturers = Manufacturer::all();
        return ManufacturerResource::collection($manufacturers);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function show(Manufacturer $manufacturer)
    {
        //
    }

    public function showApi(string $manufacturer): ManufacturerResource
    {
        $manufacturer = Manufacturer::find($manufacturer);

        if (!$manufacturer) {
            return response()->json(['error' => 'Manufacturer not found.'], 404);
        }

        return new ManufacturerResource($manufacturer);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Manufacturer $manufacturer)
    {
        //
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
