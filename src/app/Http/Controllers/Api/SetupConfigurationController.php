<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SetupConfigurationResource;
use App\Models\SetupConfiguration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class SetupConfigurationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): ResourceCollection
    {
        $configurations = SetupConfiguration::paginate(15);
        return SetupConfigurationResource::collection($configurations);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $setupConfiguration)
    {
        $configuration = SetupConfiguration::find($setupConfiguration);

        if (!$configuration) {
            return response()->json(['error' => 'Setup configuration not found.'], 404);
        }

        return new SetupConfigurationResource($configuration);
    }
}
