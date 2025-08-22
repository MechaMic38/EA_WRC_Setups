<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Public/VehicleIndex', []);
    }

    /**
     * Display a listing of the resource for admin.
     */
    public function adminIndex(Request $request): Response
    {
        $data = $request->validate([
            'page' => 'integer|min:1',
            'category_id' => 'string',
            'manufacturer_id' => 'string',
        ]);

        return Inertia::render('Admin/VehicleIndex', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehicle $vehicle)
    {
        $vehicle->load(['category', 'manufacturer']);

        return Inertia::render('Public/VehicleShow', [
            'vehicle' => new VehicleResource($vehicle)
        ]);
    }

    /**
     * Display the specified resource for admin.
     */
    public function adminShow(Vehicle $vehicle)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vehicle $vehicle)
    {
        //
    }
}
