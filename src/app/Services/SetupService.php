<?php

namespace App\Services;

use App\Models\Setup;
use App\Models\User;

class SetupService extends Service
{
    /**
     * Create a new setup, including a setup configuration, associated with the given user.
     *
     * @param array $data
     * @param array $configuration
     * @param \App\Models\User $user
     * @return \App\Models\Setup
     */
    public function createSetup(array $data, array $configuration, User $user): Setup
    {
        // Create a new setup record
        $setup = $user->setups()->create($data);

        // Create a new setup configuration record
        $setup->configuration()->create($configuration);

        return $setup;
    }

    /**
     * Update a setup.
     *
     * @param \App\Models\Setup $setup
     * @param array $data
     * @param array $configuration
     * @return \App\Models\Setup
     */
    public function updateSetup(Setup $setup, array $data, array $configuration): Setup
    {
        // TODO: separate the update of the setup record and the setup configuration record
        // Update the setup record
        $setup->update($data);

        // Update the setup configuration record
        $setup->configuration->update($configuration);

        return $setup;
    }

    /**
     * Delete a setup.
     *
     * @param \App\Models\Setup $setup
     * @return void
     */
    public function deleteSetup(Setup $setup): void
    {
        // Delete the setup configuration record
        $setup->configuration->delete();

        // Delete the setup record
        $setup->delete();
    }
}
