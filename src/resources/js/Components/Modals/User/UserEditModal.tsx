import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiCheck, FiShield } from "react-icons/fi";
import { User } from "@/types";

export default function UserEditModal({
    isOpen,
    onClose,
    user,
}: {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}) {
    const {
        data,
        setData,
        setError,
        put: updateUser,
        isProcessing,
        errors,
    } = useAxiosForm<User, { role: string }>({
        role: "user",
    });

    // Initialize form with user data
    useState(() => {
        if (user && isOpen) {
            setData({ role: user.role });
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setData({ role: value as "admin" | "user" });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        updateUser(route("api.users.update", { user: user.id }), {
            onSuccess: onClose,
        });
    };

    if (!user) return null;

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
                                            Update User Role
                                        </Dialog.Title>
                                        <button
                                            onClick={onClose}
                                            className="text-onSurface hover:text-primary"
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-6">
                                            <div className="flex items-center mb-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                                    <FiShield className="text-primary text-xl" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-onSurface">
                                                        {user.username}
                                                    </h3>
                                                    <p className="text-sm text-onSurface/70">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Account Role
                                                </label>
                                                <select
                                                    name="role"
                                                    value={data.role}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface"
                                                    required
                                                >
                                                    <option value="admin">
                                                        Administrator
                                                    </option>
                                                    <option value="user">
                                                        Regular User
                                                    </option>
                                                </select>
                                                <p className="mt-2 text-sm text-onSurface/70">
                                                    Administrators have full
                                                    access to the admin panel.
                                                </p>
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
                                                    ? "Updating..."
                                                    : "Update Role"}
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
