import { Input } from "@headlessui/react";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface TextInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    icon?: React.ReactNode;
    error?: string | null;
    className?: string;
    inputClassName?: string;
    iconClassName?: string;
}

export default function TextInput({
    value,
    onChange,
    type = "text",
    name,
    placeholder = "",
    required,
    icon,
    error,
    className,
    inputClassName,
    iconClassName,
}: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`relative flex-1 ${className}`}>
            {icon && (
                <div
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconClassName}`}
                >
                    {icon}
                </div>
            )}
            <input
                type={
                    type === "password" && !showPassword
                        ? "password"
                        : type === "password"
                        ? "text"
                        : type
                }
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full py-3 bg-surface rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary text-onSurface ${
                    error ? "border-error" : "border-surfaceContainerHigh"
                } ${icon ? "pl-10" : "pl-4"} ${
                    type === "password" ? "pr-10" : "pr-4"
                } ${inputClassName}`}
                required={required}
            />
            {type === "password" && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-onSurface/70 hover:text-onSurface transition-colors duration-200"
                >
                    {showPassword ? (
                        <FiEyeOff className="text-lg" />
                    ) : (
                        <FiEye className="text-lg" />
                    )}
                </button>
            )}
        </div>
    );
}
