import React, { useCallback, useMemo } from "react";

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
    const { min_value, max_value, steps } = option;

    // Calculate the step size (can be decimal)
    const stepSize = useMemo(() => {
        return (max_value - min_value) / (steps - 1);
    }, [min_value, max_value, steps]);

    // Calculate the current step index based on the value
    const currentStep = useMemo(() => {
        return Math.round((value - min_value) / stepSize);
    }, [value, min_value, stepSize]);

    // Generate all possible values
    const possibleValues = useMemo(() => {
        return Array.from({ length: steps }, (_, index) => {
            return min_value + index * stepSize;
        });
    }, [min_value, steps, stepSize]);

    // Calculate gradient percentage
    const gradientPercentage = useMemo(() => {
        return ((value - min_value) / (max_value - min_value)) * 100;
    }, [value, min_value, max_value]);

    // Handle input change
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const stepIndex = parseInt(e.target.value);
            const newValue = possibleValues[stepIndex];
            onChange(newValue);
        },
        [onChange, possibleValues]
    );

    return (
        <div className="w-full">
            <input
                type="range"
                min={0}
                max={steps - 1}
                step={1}
                value={currentStep}
                onChange={handleChange}
                disabled={disabled}
                className="w-full h-2 bg-surfaceContainer rounded-lg appearance-none cursor-pointer"
                style={{
                    background: `linear-gradient(to right, #CFBDFE 0%, #CFBDFE ${gradientPercentage}%, #3A3643 ${gradientPercentage}%, #3A3643 100%)`,
                }}
            />
        </div>
    );
}
