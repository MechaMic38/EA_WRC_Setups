<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SetupBlueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SetupBlueprintController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $blueprints = SetupBlueprint::all();
        return response()->json($blueprints);
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
    public function show(string $setupBlueprint): JsonResponse
    {
        $blueprint = SetupBlueprint::find($setupBlueprint);

        if (!$blueprint) {
            return response()->json(['error' => 'Blueprint not found.'], 404);
        }

        return response()->json($blueprint);
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
