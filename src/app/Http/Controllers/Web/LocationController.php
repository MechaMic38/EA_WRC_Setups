<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Location;
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
    public function adminIndex(): Response
    {
        return Inertia::render('Admin/LocationIndex', []);
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
        return Inertia::render('Public/Location', [
            'location' => $location,
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
