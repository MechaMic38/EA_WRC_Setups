import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import { User } from "@/types";

interface UserFormData {
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
}

export default function UserCreateModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const {
        data,
        setData,
        post: postUser,
        isProcessing,
        errors,
        reset,
    } = useAxiosForm<User, UserFormData>({
        username: "",
        email: "",
        password: "",
        role: "user",
    });

    const [showPassword, setShowPassword] = useState(false);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset();
            setShowPassword(false);
        }
    }, [isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postUser(route("api.users.store"), {
            onSuccess: onClose,
        });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-md transform transition-all">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <Dialog.Title className="text-2xl font-bold text-onSurface">
                                            Create New User
                                        </Dialog.Title>
                                        <button
                                            onClick={onClose}
                                            className="text-onSurface hover:text-primary"
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4 mb-6">
                                            {/* Username */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={data.username}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface"
                                                    placeholder="e.g., MechaMic_38"
                                                    required
                                                    autoFocus
                                                />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface"
                                                    placeholder="user@example.com"
                                                    required
                                                />
                                            </div>

                                            {/* Password */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        name="password"
                                                        value={data.password}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface pr-10"
                                                        placeholder="••••••••"
                                                        required
                                                        minLength={6}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            togglePasswordVisibility
                                                        }
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-onSurface/70 hover:text-onSurface"
                                                    >
                                                        {showPassword ? (
                                                            <FiEyeOff />
                                                        ) : (
                                                            <FiEye />
                                                        )}
                                                    </button>
                                                </div>
                                                <p className="mt-1 text-xs text-onSurface/50">
                                                    Minimum 6 characters
                                                </p>
                                            </div>

                                            {/* Role */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Account Type
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <label
                                                        className={`flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-colors ${
                                                            data.role ===
                                                            "admin"
                                                                ? "border-primary bg-primary/10"
                                                                : "border-surfaceContainer hover:bg-surfaceContainer/30"
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            value="admin"
                                                            checked={
                                                                data.role ===
                                                                "admin"
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            className="hidden"
                                                        />
                                                        <div className="text-center">
                                                            <div className="font-medium">
                                                                Admin
                                                            </div>
                                                            <div className="text-xs mt-1 text-onSurface/70">
                                                                Full access
                                                            </div>
                                                        </div>
                                                    </label>

                                                    <label
                                                        className={`flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-colors ${
                                                            data.role === "user"
                                                                ? "border-primary bg-primary/10"
                                                                : "border-surfaceContainer hover:bg-surfaceContainer/30"
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            value="user"
                                                            checked={
                                                                data.role ===
                                                                "user"
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            className="hidden"
                                                        />
                                                        <div className="text-center">
                                                            <div className="font-medium">
                                                                Regular User
                                                            </div>
                                                            <div className="text-xs mt-1 text-onSurface/70">
                                                                Limited access
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form Actions */}
                                        <div className="flex justify-end space-x-3 pt-4 border-t border-surfaceContainer">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-4 py-2 text-onSurface bg-surfaceContainer rounded-md hover:bg-surfaceContainer/80"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isProcessing}
                                                className={`px-4 py-2 flex items-center ${
                                                    isProcessing
                                                        ? "bg-surfaceContainer text-onSurface/50"
                                                        : "bg-primary text-surfaceContainer hover:bg-primary-600"
                                                } rounded-md`}
                                            >
                                                <FiCheck className="mr-2" />
                                                {isProcessing
                                                    ? "Creating..."
                                                    : "Create User"}
                                            </button>
                                        </div>

                                        {errors && (
                                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-md">
                                                {Object.values(errors).map(
                                                    (error, i) => (
                                                        <p key={i}>{error}</p>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
