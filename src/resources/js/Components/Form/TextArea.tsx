import { Textarea } from "@headlessui/react";
import React, { TextareaHTMLAttributes } from "react";

export default function TextArea({
    value,
    onChange,
    name,
    placeholder,
    rows,
    required,
    error,
    className = "",
    ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    value?: string;
    error?: string | null;
}) {
    return (
        <Textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className={`w-full px-4 py-2 bg-surfaceContainer rounded-lg text-onSurface border focus:border-primary focus:ring-1 focus:ring-primary ${
                error ? "border-error" : "border-surfaceContainerHigh"
            } ${className}`}
            required={required}
            placeholder={placeholder}
            {...props}
        />
    );
}
