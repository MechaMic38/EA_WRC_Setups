<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SetupConfigurationResource;
use App\Models\Setup;

class SetupConfigurationController extends Controller
{
    /**
     * Get the configuration for the specified setup.
     */
    public function show(Setup $setup)
    {
        if (is_null($setup->configuration)) {
            return response()->json(['error' => 'Setup configuration not found.'], 404);
        }

        return new SetupConfigurationResource($setup->configuration);
    }
}
