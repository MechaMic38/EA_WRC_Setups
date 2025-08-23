import { SetupOption } from "@/types";
import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";
import InputSlider from "../Form/InputSlider";

interface OptionSliderProps {
    setting: string;
    option: SetupOption;
    value: number;
    disabled?: boolean;
    onChange?: (setting: string, value: number) => void;
}

export default function OptionSlider({
    setting,
    option,
    value,
    disabled = false,
    onChange = () => {},
}: OptionSliderProps) {
    const [showDescription, setShowDescription] = useState<string | null>(null);

    return (
        <div
            key={setting}
            className="bg-surface rounded-xl p-4 border border-surfaceContainerHigh"
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <h3 className="font-medium text-onSurface mr-3">
                        {option.label}
                    </h3>
                    <button
                        onClick={() =>
                            setShowDescription(
                                showDescription === setting ? null : setting
                            )
                        }
                        className="text-primary hover:text-primary-600 transition-colors duration-200"
                    >
                        <FiInfo size={18} />
                    </button>
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {value.toFixed(option.precision)}
                    {option.unit}
                </span>
            </div>

            {showDescription === setting && (
                <div className="bg-surfaceContainer/50 p-4 rounded-lg mb-4 text-sm text-onSurface">
                    {option.description}
                </div>
            )}

            <div className="relative">
                <InputSlider
                    option={option}
                    value={value}
                    onChange={(newValue) => onChange(setting, newValue)}
                    disabled={disabled}
                />
                <div className="flex justify-between text-sm text-onSurface/70 mt-3">
                    <span>
                        {option.min_value}
                        {option.unit}
                    </span>
                    <span>
                        {option.max_value}
                        {option.unit}
                    </span>
                </div>
            </div>
        </div>
    );
}
