import { InputHTMLAttributes } from "react";

export default function Checkbox({
    className = "",
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                "shadow-sm rounded bg-surface border-surfaceContainerHigh text-primary focus:ring-primary " +
                className
            }
        />
    );
}
