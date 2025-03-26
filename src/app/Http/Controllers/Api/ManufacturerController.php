<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Manufacturers\StoreManufacturerRequest;
use App\Http\Requests\Manufacturers\UpdateManufacturerRequest;
use App\Http\Resources\ManufacturerResource;
use App\Models\Manufacturer;
use App\Services\ManufacturerService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Gate;

class ManufacturerController extends Controller
{
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
    public function store(StoreManufacturerRequest $request, ManufacturerService $manufacturerService)
    {
        $validated = $request->validated();

        $manufacturer = $manufacturerService->createManufacturer($validated, $request->file('img'));

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
    public function update(UpdateManufacturerRequest $request, Manufacturer $manufacturer, ManufacturerService $manufacturerService)
    {
        $data = $request->validated();

        $manufacturer = $manufacturerService->updateManufacturer($manufacturer, $data, $request->file('img'));

        return new ManufacturerResource($manufacturer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Manufacturer $manufacturer, ManufacturerService $manufacturerService)
    {
        Gate::authorize('delete', $manufacturer);

        $manufacturerService->deleteManufacturer($manufacturer);

        return response()->noContent();
    }
}
