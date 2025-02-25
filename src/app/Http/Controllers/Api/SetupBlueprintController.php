<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SetupBlueprintResource;
use App\Models\SetupBlueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class SetupBlueprintController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): ResourceCollection
    {
        $blueprints = SetupBlueprint::paginate(15);
        return SetupBlueprintResource::collection($blueprints);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $setupBlueprint)
    {
        $blueprint = SetupBlueprint::find($setupBlueprint);

        if (!$blueprint) {
            return response()->json(['error' => 'Blueprint not found.'], 404);
        }

        return new SetupBlueprintResource($blueprint);
    }
}
