<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\LocationSummaryResource;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Public/LocationIndex', []);
    }

    /**
     * Display a listing of the resource for admin.
     */
    public function adminIndex(Request $request): Response
    {
        $data = $request->validate([
            'page' => 'integer|min:1',
            'surface_type' => 'string'
        ]);

        return Inertia::render('Admin/LocationIndex', $data);
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
    public function show(Location $location)
    {
        return Inertia::render('Public/LocationShow', [
            'location' => new LocationSummaryResource($location),
        ]);
    }

    /**
     * Display the specified resource for admin.
     */
    public function adminShow(Location $location)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Location $location)
    {
        //
    }
}
