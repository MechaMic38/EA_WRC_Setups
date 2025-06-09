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
        // Get the setup options configuration
        $setupOptions = config('setup-options');

        // Round all configuration values according to their precision
        $configuration = $this->roundConfigurationValues($configuration, $setupOptions);

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
        // Get the setup options configuration
        $setupOptions = config('setup-options');

        // Round all configuration values according to their precision
        $configuration = $this->roundConfigurationValues($configuration, $setupOptions);

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

    /**
     * Round all configuration values according to their specified precision.
     *
     * @param array $configuration
     * @param array $setupOptions
     * @return array
     */
    protected function roundConfigurationValues(array $configuration, array $setupOptions): array
    {
        foreach ($configuration as $category => $values) {
            // Skip if category doesn't exist in setup options
            if (!isset($setupOptions[$category])) {
                continue;
            }

            foreach ($values as $key => $value) {
                // Skip if key doesn't exist in setup options or precision isn't defined
                if (!isset($setupOptions[$category][$key]['precision'])) {
                    continue;
                }

                $precision = $setupOptions[$category][$key]['precision'];
                $configuration[$category][$key] = number_format($value, $precision, '.', '');
            }
        }

        return $configuration;
    }
}
