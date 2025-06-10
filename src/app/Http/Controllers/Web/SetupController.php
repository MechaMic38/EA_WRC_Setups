<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\SetupResource;
use App\Models\Setup;
use Inertia\Inertia;

class SetupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Public/SetupIndex', []);
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
    public function show(Setup $setup)
    {
        $setup->load(['user', 'location', 'vehicle', 'configuration']);

        return Inertia::render('Public/SetupShow', [
            'setup' => new SetupResource($setup)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Setup $setup)
    {
        //
    }
}
