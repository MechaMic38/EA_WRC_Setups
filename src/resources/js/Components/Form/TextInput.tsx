import { Input } from "@headlessui/react";
import React from "react";

interface TextInputProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | null;
}

export default function TextInput({
    name,
    value,
    onChange,
    error = null,
}: TextInputProps) {
    return (
        <Input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 border rounded-lg bg-surface text-onSurface focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary transition-all duration-200 ${
                error
                    ? "border-error focus:ring-error"
                    : "border-surfaceContainerHigh hover:border-outline"
            }`}
        />
    );
}
