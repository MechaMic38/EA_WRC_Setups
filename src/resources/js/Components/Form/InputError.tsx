import React from "react";
import { FiAlertCircle } from "react-icons/fi";

interface InputErrorProps {
    message?: string | null;
    className?: string;
}

export default function InputError({ message, className }: InputErrorProps) {
    return message ? (
        <p className={`mt-1 text-sm text-error flex items-center ${className}`}>
            <FiAlertCircle className="w-4 h-4 mr-1" />
            {message}
        </p>
    ) : null;
}
