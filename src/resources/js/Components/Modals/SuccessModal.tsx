// components/Modals/SuccessModal.tsx
import { Link } from "@inertiajs/react";
import React from "react";
import { FiCheck, FiExternalLink } from "react-icons/fi";

interface SuccessModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    redirectUrl?: string;
    redirectMessage?: string;
    onRedirect?: () => void;
    duration?: number;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    title,
    message,
    redirectUrl,
    redirectMessage = "View Setup",
    onRedirect,
    duration = 3000,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

                {/* Modal */}
                <div className="relative bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <div className="px-6 py-8 text-center">
                        {/* Success Icon */}
                        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                            <FiCheck className="w-8 h-8 text-green-500" />
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-onSurface mb-2">
                            {title}
                        </h3>

                        {/* Message */}
                        <p className="text-onSurface/70 mb-6">{message}</p>

                        {/* Progress Bar */}
                        <div className="w-full bg-surfaceContainerHigh rounded-full h-2 mb-6">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-3000 ease-linear"
                                style={{
                                    animation: `progressBar ${duration}ms linear forwards`,
                                }}
                            />
                        </div>

                        {/* Redirect Button */}
                        {redirectUrl && (
                            <Link
                                href={redirectUrl}
                                onClick={onRedirect}
                                className="inline-flex items-center px-6 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium"
                            >
                                <FiExternalLink className="mr-2" />
                                {redirectMessage}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Animation styles */}
            <style>{`
                @keyframes progressBar {
                    0% { width: 100%; }
                    100% { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default SuccessModal;
