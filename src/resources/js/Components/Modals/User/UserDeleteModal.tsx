import { Description, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import {
    FiX,
    FiTrash2,
    FiAlertTriangle,
    FiUser,
    FiAlertCircle,
} from "react-icons/fi";
import { User } from "@/types";
import BaseModal from "../BaseModal";

interface UserDeleteModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UserDeleteModal({
    isOpen,
    user,
    onClose,
    onSuccess,
}: UserDeleteModalProps) {
    const { delete: deleteUser, isProcessing } = useAxiosForm<void>([]);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleDelete = () => {
        if (!user) return;

        deleteUser(route("api.users.destroy", { user: user.id }), {
            onSuccess: () => {
                onSuccess();
                onClose();
            },
            onError: (error) => {
                setShowError(true);
                setErrorMessage(
                    error.response?.data?.message ||
                        "An error occurred while deleting the user. Please try again."
                );
            },
        });
    };

    const handleClose = () => {
        setShowError(false);
        setErrorMessage("");
        onClose();
    };

    if (!user) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose}>
            <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
                <div className="flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 bg-gradient-to-r from-red-500/10 to-red-500/5 flex justify-between items-center border-b border-red-500/20">
                        <div className="flex items-center">
                            <div className="bg-red-500/20 p-3 rounded-lg mr-4">
                                <FiAlertTriangle className="text-red-500 text-xl" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-onSurface">
                                    Delete User
                                </DialogTitle>
                                <p className="text-onSurface/70 text-sm">
                                    Confirm permanent deletion
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-onSurface hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-surfaceContainerHigh"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-6">
                        {/* Error Message */}
                        {showError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-start">
                                <FiAlertCircle className="mr-2 text-red-600 mt-0.5 flex-shrink-0" />
                                <span>{errorMessage}</span>
                                <button
                                    onClick={() => setShowError(false)}
                                    className="ml-auto text-red-700 hover:text-red-900"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        )}

                        {/* Warning Icon */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border-4 border-red-500/20">
                                <FiAlertTriangle className="text-red-500 text-3xl" />
                            </div>
                        </div>

                        {/* Warning Text */}
                        <div className="text-center">
                            <Description className="text-lg font-semibold text-onSurface mb-3">
                                Are you sure you want to delete this user?
                            </Description>

                            <p className="text-onSurface/70 mb-4">
                                This action cannot be undone. All data
                                associated with this account will be permanently
                                removed.
                            </p>
                        </div>

                        {/* User Preview */}
                        <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                    <FiUser className="text-primary text-2xl" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-onSurface">
                                        {user.username}
                                    </h3>
                                    <p className="text-onSurface/70 text-sm">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Warning */}
                        <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/20">
                            <div className="flex items-start">
                                <FiAlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-onSurface/80">
                                    <strong>Warning:</strong> This action will
                                    permanently remove this user from the
                                    system. Please ensure you want to proceed.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="p-6 pt-0">
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-3 text-onSurface bg-surfaceContainer rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium"
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isProcessing}
                                className={`px-6 py-3 flex items-center rounded-xl font-medium transition-colors duration-200 ${
                                    isProcessing
                                        ? "bg-surfaceContainer text-onSurface/50 cursor-not-allowed"
                                        : "bg-red-500 text-surfaceContainer hover:bg-red-600 hover:shadow-lg transform hover:scale-105"
                                }`}
                            >
                                <FiTrash2 className="mr-2" />
                                {isProcessing ? "Deleting..." : "Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
