<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class SetupOptionsController extends Controller
{
    /**
     * Get the setup options.
     */
    public function index()
    {
        $options = config('setup-options');
        return response()->json($options);
    }
}
