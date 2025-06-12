<?php

namespace App\Services;

use App\Models\SetupBlueprint;

class SetupBlueprintService extends Service
{
    /**
     * Merge setup options into the blueprint.
     *
     * @param SetupBlueprint $blueprint
     * @return array
     */
    public function mergeSetupOptions(SetupBlueprint $blueprint): array
    {
        // Convert the blueprint to an array
        $blueprint = $blueprint->toArray();
        // Get the setup options from the configuration
        $options = $this->getSetupOptions();

        // Loop each group, each field, and merge in missing option-keys
        foreach (SetupBlueprint::GROUPS as $group) {
            if (! isset($blueprint[$group], $options[$group])) {
                continue;
            }

            foreach ($blueprint[$group] as $field => $data) {
                if (isset($options[$group][$field])) {
                    // array_merge: later values override earlier ones on duplicate keys;
                    // so putting $data second means we keep blueprint’s min/max/default/steps,
                    // but we pull in unit, label, description, precision, etc. from options.
                    $blueprint[$group][$field] = array_merge(
                        $options[$group][$field],
                        $data
                    );
                }
            }
        }

        return $blueprint;
    }

    /**
     * Get the setup options from the configuration.
     *
     * @return array
     */
    public function getSetupOptions(): array
    {
        return config("setup-options");
    }
}
