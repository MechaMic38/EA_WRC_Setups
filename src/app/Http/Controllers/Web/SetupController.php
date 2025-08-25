<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\SetupResource;
use App\Models\Setup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SetupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function userIndex(Request $request)
    {
        $data = $request->validate([
            'page' => 'integer|min:1',
            'vehicle_id' => 'string',
            'location_id' => 'string',
        ]);

        return Inertia::render('Profile/UserSetupIndex', $data);
    }


    /**
     * Show the location page of the setup creation wizard.
     */
    public function createLocation()
    {
        return Inertia::render('SetupWizard/Location');
    }

    /**
     * Show the vehicle page of the setup creation wizard.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function createVehicle(Request $request)
    {
        $data = $request->validate([
            'location_id' => 'required|exists:locations,id'
        ]);

        return Inertia::render('SetupWizard/Vehicle', [
            'location_id' => $data['location_id'],
        ]);
    }

    /**
     * Show the options page of the setup creation wizard.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function createOptions(Request $request)
    {
        $data = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'vehicle_id' => 'required|exists:vehicles,id'
        ]);

        return Inertia::render('SetupWizard/Options', [
            'location_id' => $data['location_id'],
            'vehicle_id' => $data['vehicle_id'],
        ]);
    }

    /**
     * Show the configurations page of the setup creation wizard.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function createConfiguration(Request $request)
    {
        $data = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'surface_condition' => 'required|string',
            'season' => 'required|string',
            'tyres' => 'required|string',
        ]);

        return Inertia::render('SetupWizard/SetupCreation', [
            'location_id' => $data['location_id'],
            'vehicle_id' => $data['vehicle_id'],
            'surface_condition' => $data['surface_condition'],
            'season' => $data['season'],
            'tyres' => $data['tyres'],
        ]);
    }

    public function editConfiguration(Setup $setup)
    {
        Gate::authorize('update', $setup);

        $setup->load(['user', 'location', 'vehicle', 'configuration', 'vehicle.category', 'vehicle.manufacturer']);

        return Inertia::render('SetupWizard/SetupEditing', [
            'setup' => new SetupResource($setup)
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Setup $setup)
    {
        $setup->load(['user', 'location', 'vehicle', 'configuration', 'vehicle.category', 'vehicle.manufacturer']);

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
