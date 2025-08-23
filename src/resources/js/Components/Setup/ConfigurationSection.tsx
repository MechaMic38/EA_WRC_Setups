import { SetupOption, SetupSection } from "@/types";
import OptionSlider from "./OptionSlider";

interface ConfigurationSectionProps {
    section: SetupSection;
    options: Record<string, number>;
    blueprintOptions: Record<string, SetupOption>;
    disabled?: boolean;
    onConfigurationChange?: (
        section: SetupSection,
        setting: string,
        value: number
    ) => void;
    onReset?: (section: SetupSection) => void;
}

export default function ConfigurationSection({
    section,
    options,
    blueprintOptions,
    disabled = false,
    onConfigurationChange = () => {},
    onReset = () => {},
}: ConfigurationSectionProps) {
    return (
        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-onSurface capitalize">
                    {section.replace("_", " ")}
                </h3>
                <button
                    onClick={() => onReset(section)}
                    className="px-4 py-2 bg-surface text-primary border border-primary rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 text-sm font-medium"
                >
                    Reset to Default
                </button>
            </div>

            <div className="space-y-6">
                {Object.entries(blueprintOptions).map(([setting, option]) => (
                    <OptionSlider
                        key={setting}
                        setting={setting}
                        option={option}
                        disabled={disabled}
                        value={options[setting] ?? option.default_value}
                        onChange={(setting, value) =>
                            onConfigurationChange(section, setting, value)
                        }
                    />
                ))}
            </div>
        </div>
    );
}
