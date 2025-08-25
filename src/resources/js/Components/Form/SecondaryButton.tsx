import { ButtonHTMLAttributes } from "react";

export default function SecondaryButton({
    type = "button",
    className = "",
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `px-6 py-3 text-onSurface bg-surfaceContainer rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium ${
                    disabled && "opacity-25"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
