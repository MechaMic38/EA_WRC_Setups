<?php

namespace App\Http\Controllers;

use App\Models\SetupBlueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SetupBlueprintController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Display a listing of the resource.
     */
    public function indexApi(): JsonResponse
    {
        $blueprints = SetupBlueprint::all();
        return response()->json($blueprints);
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
    public function show(SetupBlueprint $setupBlueprint)
    {
        //
    }

    public function showApi(string $blueprint): JsonResponse
    {
        $blueprint = SetupBlueprint::find($blueprint);

        if (!$blueprint) {
            return response()->json(['error' => 'Blueprint not found.'], 404);
        }

        return response()->json($blueprint);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SetupBlueprint $setupBlueprint)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SetupBlueprint $setupBlueprint)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SetupBlueprint $setupBlueprint)
    {
        //
    }
}
