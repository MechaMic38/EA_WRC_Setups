import { ButtonHTMLAttributes } from "react";

export default function DangerButton({
    className = "",
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`px-6 py-3 flex items-center rounded-xl font-medium transition-colors duration-200 ${
                disabled
                    ? "bg-surfaceContainer text-onSurface/50 cursor-not-allowed"
                    : "bg-errorContainer/80 text-onErrorContainer hover:bg-errorContainer hover:shadow-lg"
            } ${className}`}
        >
            {children}
        </button>
    );
}
