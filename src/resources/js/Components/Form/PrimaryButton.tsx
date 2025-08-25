import { ButtonHTMLAttributes } from "react";

export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-lg hover:shadow-xl ${
                disabled
                    ? "bg-primary text-surfaceContainer opacity-50 cursor-not-allowed"
                    : "bg-primary/80 text-surfaceContainer hover:bg-primary hover:shadow-lg"
            } ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
