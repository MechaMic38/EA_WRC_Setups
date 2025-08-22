import React from "react";
import { FiAlertCircle } from "react-icons/fi";

interface ErrorTextProps {
    message: string;
}

export default function ErrorText({ message }: ErrorTextProps) {
    return (
        <p className="mt-1 text-sm text-error flex items-center">
            <FiAlertCircle className="w-4 h-4 mr-1" />
            {message}
        </p>
    );
}
