import React from "react";

interface InputSliderProps {
    option: {
        min_value: number;
        max_value: number;
        steps: number;
    };
    value: number;
    disabled?: boolean;
    onChange?: (value: number) => void;
}

export default function InputSlider({
    option,
    value,
    disabled = false,
    onChange = () => {},
}: InputSliderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled && onChange) {
            onChange(Number(e.target.value));
        }
    };

    return (
        <input
            type="range"
            min={option.min_value}
            max={option.max_value}
            step={(option.max_value - option.min_value) / (option.steps - 1)}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className="w-full h-2 bg-surfaceContainer rounded-lg appearance-none cursor-pointer"
            style={{
                background: `linear-gradient(to right, #CFBDFE 0%, #CFBDFE ${
                    ((value - option.min_value) /
                        (option.max_value - option.min_value)) *
                    100
                }%, #3A3643 ${
                    ((value - option.min_value) /
                        (option.max_value - option.min_value)) *
                    100
                }%, #3A3643 100%)`,
            }}
        />
    );
}
