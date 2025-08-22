import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="mt-6 p-4 bg-errorContainer/20 border border-errorContainer rounded-lg">
            <div className="flex items-center text-onErrorContainer">
                <FiAlertTriangle className="w-5 h-5 mr-2" />
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
}
