import React from "react";
import { FiCheck } from "react-icons/fi";

interface SuccessMessageProps {
    message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
    return (
        <div className="mt-6 p-4 bg-primaryContainer/20 border border-primaryContainer rounded-lg">
            <div className="flex items-center text-onPrimaryContainer">
                <FiCheck className="w-5 h-5 mr-2" />
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
}
