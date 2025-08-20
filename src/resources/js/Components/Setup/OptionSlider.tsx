import { SetupOption } from "@/types";
import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";
import InputSlider from "./InputSlider";

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
        <div key={setting} className="mb-6">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                    <h3 className="font-medium text-onSurface mr-2">
                        {option.label}
                    </h3>
                    <button
                        onClick={() =>
                            setShowDescription(
                                showDescription === setting ? null : setting
                            )
                        }
                        className="text-primary hover:text-primary-600"
                    >
                        <FiInfo size={16} />
                    </button>
                </div>
                <span className="bg-surfaceContainer px-3 py-1 rounded-full text-onSurface">
                    {value.toFixed(option.precision)}
                    {option.unit}
                </span>
            </div>

            {showDescription === setting && (
                <div className="bg-surfaceContainer/50 p-3 rounded-lg mb-3 text-sm text-onSurface">
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
                <div className="flex justify-between text-xs text-onSurface/70 mt-1">
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
