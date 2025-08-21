import {
    Description,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiTrash2, FiAlertTriangle, FiUser } from "react-icons/fi";
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

    const handleDelete = () => {
        if (!user) return;

        deleteUser(route("api.users.destroy", { user: user.id }), {
            onSuccess: () => {
                onSuccess();
                onClose();
            },
        });
    };

    if (!user) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <DialogPanel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <DialogTitle className="text-2xl font-bold text-onSurface">
                            Delete User Account
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="text-onSurface hover:text-primary"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                            <FiAlertTriangle className="text-red-500 text-2xl" />
                        </div>

                        <Description className="text-lg font-medium text-onSurface mb-2">
                            Are you sure you want to delete this user account?
                        </Description>

                        <p className="text-onSurface/70 mb-4">
                            This action cannot be undone. All data associated
                            with this account will be permanently removed.
                        </p>

                        <div className="bg-surface rounded-lg p-4 w-full">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-surfaceContainer flex items-center justify-center mr-4">
                                    <FiUser className="text-onSurface" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-onSurface">
                                        {user.username}
                                    </div>
                                    <div className="text-sm text-onSurface/70">
                                        {user.email}
                                    </div>
                                    <div className="mt-1">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${
                                                user.role === "admin"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-surfaceContainer text-onSurface"
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-surfaceContainer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-onSurface bg-surfaceContainer rounded-md hover:bg-surfaceContainer/80"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isProcessing}
                            className={`px-4 py-2 flex items-center ${
                                isProcessing
                                    ? "bg-surfaceContainer text-onSurface/50"
                                    : "bg-red-500 text-surfaceContainer hover:bg-red-600"
                            } rounded-md`}
                        >
                            <FiTrash2 className="mr-2" />
                            {isProcessing ? "Deleting..." : "Delete Account"}
                        </button>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
