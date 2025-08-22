import { DialogPanel, DialogTitle, Field, Label } from "@headlessui/react";
import { useState, useEffect } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiCheck, FiShield, FiUser, FiAlertCircle } from "react-icons/fi";
import { User } from "@/types";
import BaseModal from "../BaseModal";

interface UserEditModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onSuccess: (user: User) => void;
}

export default function UserEditModal({
    isOpen,
    user,
    onClose,
    onSuccess,
}: UserEditModalProps) {
    const {
        data,
        setData,
        patch: updateUser,
        isProcessing,
        errors,
        clearErrors,
    } = useAxiosForm<User, { role: string }>({
        role: "user",
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Initialize form with user data
    useEffect(() => {
        if (user && isOpen) {
            setData({ role: user.role });
            clearErrors();
            setShowSuccess(false);
            setShowError(false);
            setErrorMessage("");
        }
    }, [user, isOpen]);

    const handleRoleChange = (role: "admin" | "user") => {
        setData({ role });

        // Clear error when user changes role
        if (errors.role) {
            clearErrors();
            setShowError(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(false);
        setShowError(false);
        setErrorMessage("");

        if (!user) return;

        updateUser(route("api.users.update", { user: user.id }), {
            onSuccess: (res) => {
                setShowSuccess(true);
                setTimeout(() => {
                    onSuccess(res.data);
                    onClose();
                }, 1500);
            },
            onError: (error) => {
                setShowError(true);
                setErrorMessage(
                    error.response?.data?.message ||
                        "An error occurred while updating the user role. Please try again."
                );
            },
        });
    };

    const handleClose = () => {
        setShowSuccess(false);
        setShowError(false);
        setErrorMessage("");
        clearErrors();
        onClose();
    };

    if (!user) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose}>
            <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
                <div className="flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 bg-gradient-to-r from-surfaceContainerHigh to-surfaceContainer flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-primaryContainer/20 p-3 rounded-lg mr-4">
                                <FiShield className="text-primary text-xl" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-onSurface">
                                    Update User Role
                                </DialogTitle>
                                <p className="text-onSurface/70 text-sm">
                                    Modify user permissions
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-onSurface hover:text-primary transition-colors duration-200 p-1 rounded-full hover:bg-surfaceContainerHigh"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-6">
                        {/* Success Message */}
                        {showSuccess && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
                                <FiCheck className="mr-2 text-green-600" />
                                <span>User role updated successfully!</span>
                            </div>
                        )}

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

                        {/* User Info */}
                        <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                    <FiUser className="text-primary text-xl" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-onSurface text-lg">
                                        {user.username}
                                    </h3>
                                    <p className="text-sm text-onSurface/70">
                                        {user.email}
                                    </p>
                                    <div className="mt-1">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                user.role === "admin"
                                                    ? "bg-red-100 text-red-800 border border-red-200"
                                                    : "bg-surfaceContainer text-onSurface border border-surfaceContainerHigh"
                                            }`}
                                        >
                                            Current:{" "}
                                            {user.role === "admin"
                                                ? "Administrator"
                                                : "Regular User"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-center mb-4">
                                <div className="bg-secondaryContainer/20 p-2 rounded-lg mr-3">
                                    <FiShield className="text-secondary text-lg" />
                                </div>
                                <Label className="block text-sm font-medium text-onSurface/70">
                                    Select New Role
                                </Label>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <label
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                        data.role === "admin"
                                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                                            : "border-surfaceContainerHigh hover:border-primary/30 hover:bg-surfaceContainer/50"
                                    }`}
                                    onClick={() => handleRoleChange("admin")}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={data.role === "admin"}
                                        onChange={() => {}}
                                        className="hidden"
                                    />
                                    <FiShield
                                        className={`text-lg mb-2 ${
                                            data.role === "admin"
                                                ? "text-primary"
                                                : "text-onSurface/70"
                                        }`}
                                    />
                                    <div className="text-center">
                                        <div className="font-medium text-onSurface">
                                            Administrator
                                        </div>
                                        <div className="text-xs mt-1 text-onSurface/60">
                                            Full access
                                        </div>
                                    </div>
                                </label>

                                <label
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                        data.role === "user"
                                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                                            : "border-surfaceContainerHigh hover:border-primary/30 hover:bg-surfaceContainer/50"
                                    }`}
                                    onClick={() => handleRoleChange("user")}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="user"
                                        checked={data.role === "user"}
                                        onChange={() => {}}
                                        className="hidden"
                                    />
                                    <FiUser
                                        className={`text-lg mb-2 ${
                                            data.role === "user"
                                                ? "text-primary"
                                                : "text-onSurface/70"
                                        }`}
                                    />
                                    <div className="text-center">
                                        <div className="font-medium text-onSurface">
                                            Regular User
                                        </div>
                                        <div className="text-xs mt-1 text-onSurface/60">
                                            Limited access
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <p className="mt-4 text-sm text-onSurface/60 p-3 bg-surfaceContainerHigh rounded-lg">
                                <FiAlertCircle className="inline mr-1 text-sm" />
                                Administrators have full access to the admin
                                panel and system settings.
                            </p>

                            {errors.role && (
                                <p className="text-red-500 text-sm mt-3 flex items-center">
                                    <FiAlertCircle className="mr-1" />
                                    {errors.role}
                                </p>
                            )}
                        </Field>
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
                                type="submit"
                                onClick={handleSubmit}
                                disabled={
                                    isProcessing || data.role === user.role
                                }
                                className={`px-6 py-3 flex items-center rounded-xl font-medium transition-colors duration-200 ${
                                    isProcessing || data.role === user.role
                                        ? "bg-surfaceContainer text-onSurface/50 cursor-not-allowed"
                                        : "bg-primary text-surfaceContainer hover:bg-primary-600"
                                }`}
                            >
                                <FiCheck className="mr-2" />
                                {isProcessing ? "Updating..." : "Update Role"}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
