import {
    DialogPanel,
    DialogTitle,
    Field,
    Input,
    Label,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import {
    FiX,
    FiCheck,
    FiEye,
    FiEyeOff,
    FiUser,
    FiMail,
    FiShield,
    FiLock,
    FiAlertCircle,
} from "react-icons/fi";
import { User } from "@/types";
import BaseModal from "../BaseModal";

interface UserFormData {
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
}

interface UserCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: User) => void;
}

export default function UserCreateModal({
    isOpen,
    onClose,
    onSuccess,
}: UserCreateModalProps) {
    const {
        data,
        setData,
        post: postUser,
        isProcessing,
        errors,
        reset,
        clearErrors,
    } = useAxiosForm<User, UserFormData>({
        username: "",
        email: "",
        password: "",
        role: "user",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset();
            clearErrors();
            setShowPassword(false);
            setShowSuccess(false);
            setShowError(false);
            setErrorMessage("");
        }
    }, [isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            clearErrors();
            setShowError(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(false);
        setShowError(false);
        setErrorMessage("");

        postUser(route("api.users.store"), {
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
                        "An error occurred while creating the user. Please try again."
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

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose}>
            <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
                <div className="flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 bg-gradient-to-r from-surfaceContainerHigh to-surfaceContainer flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-primaryContainer/20 p-3 rounded-lg mr-4">
                                <FiUser className="text-primary text-xl" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-onSurface">
                                    Create User
                                </DialogTitle>
                                <p className="text-onSurface/70 text-sm">
                                    Add a new user account
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
                                <span>User created successfully!</span>
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

                        {/* Username */}
                        <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-center mb-3">
                                <div className="bg-primaryContainer/20 p-2 rounded-lg mr-3">
                                    <FiUser className="text-primary text-lg" />
                                </div>
                                <Label className="block text-sm font-medium text-onSurface/70">
                                    Username
                                </Label>
                            </div>
                            <Input
                                type="text"
                                name="username"
                                value={data.username}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-surfaceContainer rounded-lg text-onSurface border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary"
                                placeholder="e.g., MechaMic_38"
                                required
                                autoFocus
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <FiAlertCircle className="mr-1" />
                                    {errors.username}
                                </p>
                            )}
                        </Field>

                        {/* Email */}
                        <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-center mb-3">
                                <div className="bg-secondaryContainer/20 p-2 rounded-lg mr-3">
                                    <FiMail className="text-secondary text-lg" />
                                </div>
                                <Label className="block text-sm font-medium text-onSurface/70">
                                    Email Address
                                </Label>
                            </div>
                            <Input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-surfaceContainer rounded-lg text-onSurface border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary"
                                placeholder="user@example.com"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <FiAlertCircle className="mr-1" />
                                    {errors.email}
                                </p>
                            )}
                        </Field>

                        {/* Password */}
                        <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-center mb-3">
                                <div className="bg-tertiaryContainer/20 p-2 rounded-lg mr-3">
                                    <FiLock className="text-tertiary text-lg" />
                                </div>
                                <Label className="block text-sm font-medium text-onSurface/70">
                                    Password
                                </Label>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-surfaceContainer rounded-lg text-onSurface border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary pr-10"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-onSurface/70 hover:text-onSurface transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="text-lg" />
                                    ) : (
                                        <FiEye className="text-lg" />
                                    )}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-onSurface/50">
                                Minimum 6 characters
                            </p>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <FiAlertCircle className="mr-1" />
                                    {errors.password}
                                </p>
                            )}
                        </Field>

                        {/* Role */}
                        <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-center mb-3">
                                <div className="bg-primaryContainer/20 p-2 rounded-lg mr-3">
                                    <FiShield className="text-primary text-lg" />
                                </div>
                                <Label className="block text-sm font-medium text-onSurface/70">
                                    Account Type
                                </Label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <label
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                        data.role === "admin"
                                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                                            : "border-surfaceContainerHigh hover:border-primary/30 hover:bg-surfaceContainer/50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={data.role === "admin"}
                                        onChange={handleInputChange}
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
                                            Admin
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
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="user"
                                        checked={data.role === "user"}
                                        onChange={handleInputChange}
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
                                disabled={isProcessing}
                                className={`px-6 py-3 flex items-center rounded-xl font-medium transition-colors duration-200 ${
                                    isProcessing
                                        ? "bg-surfaceContainer text-onSurface/50"
                                        : "bg-primary text-surfaceContainer hover:bg-primary-600"
                                }`}
                            >
                                <FiCheck className="mr-2" />
                                {isProcessing ? "Creating..." : "Create User"}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
